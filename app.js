// إعدادات Firebase الخاصة بيك (تم تحديثها بمفاتيح مشروعك)
const firebaseConfig = {
    apiKey: "AIzaSyBWqNsARAXLdrh2qhgVjgZZLrWzw_zpsME",
    authDomain: "sonory-f6399.firebaseapp.com",
    projectId: "sonory-f6399",
    storageBucket: "sonory-f6399.firebasestorage.app",
    messagingSenderId: "791851428859",
    appId: "1:791851428859:web:cfbfe475c9c7828d67f95e",
    measurementId: "G-MFDGFMEW08"
};

// تهيئة المشروع للعمل مع ملفات HTML
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// دالة تسجيل الدخول والتوجيه الذكي
function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    message.innerText = "جاري تسجيل الدخول...";

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            // جلب صلاحية المستخدم من قاعدة البيانات باستخدام الـ UID
            db.collection("Users").doc(user.uid).get().then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    const role = userData.role;

                    // التوجيه الذكي حسب الصلاحية
                    if (role === "admin") {
                        window.location.href = "admin_dashboard.html";
                    } else if (role === "teacher") {
                        window.location.href = "teacher_dashboard.html";
                    } else if (role === "student") {
                        window.location.href = "student_dashboard.html";
                    } else {
                        message.innerText = "صلاحية غير معروفة بالحساب!";
                    }
                } else {
                    message.innerText = "بيانات المستخدم غير موجودة في قاعدة البيانات (Firestore). تأكد من ربط الـ UID.";
                }
            }).catch((error) => {
                message.innerText = "خطأ في قراءة البيانات: " + error.message;
            });

        })
        .catch((error) => {
            message.innerText = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
        });
}
