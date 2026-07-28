const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

/**
 * Call this right after OTP verification (before or after the class
 * lookup below — order doesn't matter). It returns everything needed
 * to build the "Switch account" list: every child linked to this phone
 * number across ALL classes, plus every class this phone teaches, if any.
 *
 * This is what makes "Switch account" work without re-entering an OTP —
 * the phone number's Firebase Auth session already covers every profile
 * returned here.
 */
exports.getMyProfile = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.token.phone_number) {
    throw new functions.https.HttpsError("unauthenticated", "Verify OTP first.");
  }
  const phone = context.auth.token.phone_number;

  const userDoc = await db.collection("users").doc(phone).get();
  if (!userDoc.exists) {
    throw new functions.https.HttpsError(
      "not-found",
      "This number isn't linked to any student or class. Contact the school office."
    );
  }
  const user = userDoc.data();
  const profiles = { parentProfiles: [], teacherProfiles: [] };

  if (user.linkedStudentIds && user.linkedStudentIds.length) {
    const refs = user.linkedStudentIds.map((id) => db.collection("students").doc(id));
    const snaps = await db.getAll(...refs);
    profiles.parentProfiles = snaps
      .filter((s) => s.exists)
      .map((s) => ({ studentId: s.id, name: s.data().name, className: s.data().className }));
  }

  if (user.classIds && user.classIds.length) {
    const refs = user.classIds.map((id) => db.collection("classes").doc(id));
    const snaps = await db.getAll(...refs);
    profiles.teacherProfiles = snaps
      .filter((s) => s.exists)
      .map((s) => ({ classId: s.id, className: s.data().className }));
  }

  return profiles;
});

/**
 * Called with the classId chosen on the login screen, right after OTP
 * verification. Returns 0, 1, or many matching students for the
 * (phone, class) pair — this is the result the client branches on:
 *   0     -> show "no student found" error
 *   1     -> auto-open that student's dashboard
 *   many  -> show the "select student" screen (twins / siblings in
 *            the same class)
 */
exports.resolveClassLogin = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.token.phone_number) {
    throw new functions.https.HttpsError("unauthenticated", "Verify OTP first.");
  }
  const phone = context.auth.token.phone_number;
  const classId = data.classId;
  if (!classId) {
    throw new functions.https.HttpsError("invalid-argument", "classId is required.");
  }

  const snap = await db
    .collection("students")
    .where("classId", "==", classId)
    .where("parentPhoneNumbers", "array-contains", phone)
    .get();

  return {
    matches: snap.docs.map((d) => ({
      studentId: d.id,
      name: d.data().name,
      className: d.data().className,
    })),
  };
});
