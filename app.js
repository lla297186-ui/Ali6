// 1. إعدادات Firebase الخاصة بيك (تنسخها من اعدادات مشروعك)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// تهيئة المشروع
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 2. دالة تسجيل الدخول
function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    message.innerText = "جاري تسجيل الدخول...";

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            // 3. جلب صلاحية المستخدم من قاعدة البيانات
            db.collection("Users").doc(user.uid).get().then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    const role = userData.role;

                    // 4. التوجيه الذكي حسب الصلاحية
                    if (role === "admin") {
                        window.location.href = "admin_dashboard.html";
                    } else if (role === "teacher") {
                        window.location.href = "teacher_dashboard.html";
                    } else if (role === "student") {
                        window.location.href = "student_dashboard.html";
                    } else {
                        message.innerText = "صلاحية غير معروفة!";
                    }
                } else {
                    message.innerText = "بيانات المستخدم غير موجودة في القاعدة.";
                }
            }).catch((error) => {
                message.innerText = "خطأ في جلب البيانات: " + error.message;
            });

        })
        .catch((error) => {
            message.innerText = "البريد أو كلمة المرور غير صحيحة.";
        });
}
