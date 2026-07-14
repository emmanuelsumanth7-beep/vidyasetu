import pandas as pd
import numpy as np

# Set random seed for reproducibility
np.random.seed(42)

NUM_STUDENTS = 2000

# Generate Synthetic Data
student_ids = [f"S_{i:04d}" for i in range(1, NUM_STUDENTS + 1)]

# Features
attendance = np.random.normal(85, 10, NUM_STUDENTS).clip(40, 100)
assign_score = np.random.normal(75, 15, NUM_STUDENTS).clip(20, 100)
midterm_score = np.random.normal(70, 20, NUM_STUDENTS).clip(10, 100)

# Simulate target based on features + noise
# High attendance and scores -> higher chance to pass
logit = -15 + 0.1 * attendance + 0.05 * assign_score + 0.08 * midterm_score
prob_pass = 1 / (1 + np.exp(-logit))
pass_fail = (np.random.rand(NUM_STUDENTS) < prob_pass).astype(int)

# Create DataFrame
df_performance = pd.DataFrame({
    'student_id': student_ids,
    'attendance': attendance,
    'assign_score': assign_score,
    'midterm_score': midterm_score,
    'pass_fail': pass_fail
})

df_performance.to_csv('student_performance.csv', index=False)
print("Generated student_performance.csv")

# Generate Exam Data for Clustering (Math, English, Science)
math_pct = np.random.normal(70, 15, NUM_STUDENTS).clip(0, 100)
english_pct = np.random.normal(75, 12, NUM_STUDENTS).clip(0, 100)
science_pct = np.random.normal(68, 18, NUM_STUDENTS).clip(0, 100)

df_exams = pd.DataFrame({
    'student_id': student_ids,
    'math_pct': math_pct,
    'english_pct': english_pct,
    'science_pct': science_pct
})

df_exams.to_csv('exam_results.csv', index=False)
print("Generated exam_results.csv")
