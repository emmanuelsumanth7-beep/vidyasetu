from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.cluster import KMeans
from ortools.sat.python import cp_model
import os

app = Flask(__name__)
CORS(app)

# --- 1. Train Performance Prediction Model on Startup ---
try:
    df_perf = pd.read_csv('student_performance.csv')
    X_train = df_perf[['attendance', 'assign_score', 'midterm_score']]
    y_train = df_perf['pass_fail']
    
    perf_model = LogisticRegression(max_iter=1000)
    perf_model.fit(X_train, y_train)
    print("Performance Model Trained Successfully.")
except Exception as e:
    print(f"Error training performance model: {e}")
    perf_model = None

# --- 2. Load Exam Data for Clustering ---
try:
    df_exams = pd.read_csv('exam_results.csv')
    X_exams = df_exams[['math_pct', 'english_pct', 'science_pct']].dropna()
    kmeans = KMeans(n_clusters=3, random_state=42)
    kmeans.fit(X_exams)
    df_exams['cluster'] = kmeans.labels_
    print("Exam Clustering Initialized.")
except Exception as e:
    print(f"Error initializing clustering: {e}")
    df_exams = None
    kmeans = None

@app.route('/api/ai/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "vidyasetu-ai-engine"})

# --- Prediction Endpoint ---
@app.route('/api/ai/performance/predict', methods=['POST'])
def predict_performance():
    if not perf_model:
        return jsonify({"error": "Model not initialized"}), 500
        
    data = request.json
    try:
        # Expecting a list of students: [{'id': 'S1', 'attendance': 90, 'assign_score': 85, 'midterm_score': 78}]
        results = []
        for student in data.get('students', []):
            features = [[student['attendance'], student['assign_score'], student['midterm_score']]]
            prob = perf_model.predict_proba(features)[0][1] # Probability of passing (1)
            results.append({
                "student_id": student.get("id"),
                "pass_probability": round(prob * 100, 2),
                "risk_level": "High" if prob < 0.4 else "Medium" if prob < 0.7 else "Low"
            })
        return jsonify({"predictions": results})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# --- Clustering Endpoint ---
@app.route('/api/ai/exams/clusters', methods=['GET'])
def get_exam_clusters():
    if df_exams is None or kmeans is None:
        return jsonify({"error": "Clustering data not available"}), 500
        
    # Return aggregated cluster stats
    centroids = kmeans.cluster_centers_
    cluster_stats = []
    
    for i, centroid in enumerate(centroids):
        count = int((df_exams['cluster'] == i).sum())
        # Interpret clusters based on average score (simplistic heuristic)
        avg_score = centroid.mean()
        if avg_score > 75:
            label = "High Achievers"
        elif avg_score > 60:
            label = "Steady Performers"
        else:
            label = "At Risk"
            
        cluster_stats.append({
            "cluster_id": i,
            "label": label,
            "student_count": count,
            "avg_math": round(centroid[0], 1),
            "avg_english": round(centroid[1], 1),
            "avg_science": round(centroid[2], 1)
        })
        
    # Sort by avg score descending
    cluster_stats.sort(key=lambda x: x["avg_math"] + x["avg_english"] + x["avg_science"], reverse=True)
    return jsonify({"clusters": cluster_stats})

# --- Timetabling OR-Tools Endpoint ---
@app.route('/api/ai/timetable/generate', methods=['POST'])
def generate_timetable():
    data = request.json
    # Expecting simple config for MVP: { classes: ['8A', '8B'], teachers: ['T1', 'T2'], ... }
    
    classes = data.get('classes', ['8A', '8B'])
    teachers = data.get('teachers', ['T1', 'T2'])
    subjects = data.get('subjects', ['Math', 'English'])
    timeslots = data.get('timeslots', ['09:00', '10:00', '11:00'])
    rooms = data.get('rooms', ['R1', 'R2'])
    
    model = cp_model.CpModel()
    
    # x[c, s, t, r] = 1 if class c has subject s at time t in room r
    x = {}
    for c in classes:
        for s in subjects:
            for t in timeslots:
                for r in rooms:
                    x[(c, s, t, r)] = model.NewBoolVar(f"x_{c}_{s}_{t}_{r}")
                    
    # Constraint 1: Each class should have exactly 1 period of each subject (simplistic for MVP)
    for c in classes:
        for s in subjects:
            model.Add(sum(x[(c, s, t, r)] for t in timeslots for r in rooms) == 1)
            
    # Constraint 2: A room can only host one class at a time
    for r in rooms:
        for t in timeslots:
            model.Add(sum(x[(c, s, t, r)] for c in classes for s in subjects) <= 1)
            
    # Constraint 3: A class can only be in one room at a time
    for c in classes:
        for t in timeslots:
            model.Add(sum(x[(c, s, t, r)] for s in subjects for r in rooms) <= 1)
            
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 10.0
    status = solver.Solve(model)
    
    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        schedule = []
        for t in timeslots:
            row = {"time": t}
            for c in classes:
                assigned = False
                for s in subjects:
                    for r in rooms:
                        if solver.Value(x[(c, s, t, r)]) == 1:
                            row[c] = f"{s} ({r})"
                            assigned = True
                if not assigned:
                    row[c] = "Free"
            schedule.append(row)
        return jsonify({"status": "success", "schedule": schedule})
    else:
        return jsonify({"status": "failed", "reason": "No feasible schedule found."}), 400

if __name__ == '__main__':
    app.run(port=5001, debug=True)
