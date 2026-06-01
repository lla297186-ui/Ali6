// 1. مفاتيح الفايربيس للمشروع الجديد (students)
const firebaseConfig = {
    apiKey: "AIzaSyA1Di6zt1kaF9LGued3Ow8igItK-SUI0tk",
    authDomain: "students-7e197.firebaseapp.com",
    projectId: "students-7e197",
    storageBucket: "students-7e197.firebasestorage.app",
    messagingSenderId: "215024838703",
    appId: "1:215024838703:web:b484ebd7928f8bf12dbeda",
    measurementId: "G-D0RP0NH6H3"
};

// 2. تهيئة الفايربيس
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ==========================================
// 3. دالة إنشاء حساب جديد (مربوطة بصفحة register.html)
// ==========================================
function registerUser() {
    const name = document.getElementById("reg-name") ? document.getElementById("reg-name").value : "";
    const email = document.getElementById("reg-email") ? document.getElementById("reg-email").value : "";
    const password = document.getElementById("reg-password") ? document.getElementById("reg-password").value : "";
    const message = document.getElementById("message");

    if(!name || !email || !password) {
        message.innerText = "يرجى تعبئة جميع الحقول أولاً.";
        return;
    }

    message.style.color = "#2563eb";
    message.innerText = "جاري إنشاء الحساب وإعداد قاعدة البيانات...";

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            // إضافة البيانات تلقائياً للـ Firestore
            db.collection("Users").doc(user.uid).set({
                name: name,
                email: email,
                role: "admin" // تحديد الصلاحية كمدير تلقائياً
            }).then(() => {
                message.style.color = "#10b981";
                message.innerText = "تم التسجيل بنجاح! جاري توجيهك...";
                setTimeout(() => {
                    window.location.href = "admin_dashboard.html";
                }, 1500);
            }).catch((error) => {
                message.style.color = "red";
                message.innerText = "حدث خطأ في قاعدة البيانات: " + error.message;
            });

        })
        .catch((error) => {
            message.style.color = "red";
            message.innerText = "خطأ: " + error.message;
        });
}

// ==========================================
// 4. دالة تسجيل الدخول (مربوطة بصفحة index.html)
// ==========================================
function loginUser() {
    const email = document.getElementById("email") ? document.getElementById("email").value : "";
    const password = document.getElementById("password") ? document.getElementById("password").value : "";
    const message = document.getElementById("message");

    if(!email || !password) {
        message.innerText = "يرجى إدخال البريد وكلمة المرور.";
        return;
    }

    message.style.color = "#2563eb";
    message.innerText = "جاري تسجيل الدخول...";

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            db.collection("Users").doc(user.uid).get().then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    const role = userData.role;

                    if (role === "admin") {
                        window.location.href = "admin_dashboard.html";
                    } else if (role === "teacher") {
                        window.location.href = "teacher_dashboard.html";
                    } else if (role === "student") {
                        window.location.href = "student_dashboard.html";
                    } else {
                        message.style.color = "red";
                        message.innerText = "صلاحية غير معروفة بالحساب!";
                    }
                } else {
                    message.style.color = "red";
                    message.innerText = "بيانات المستخدم غير موجودة بقاعدة البيانات.";
                }
            }).catch((error) => {
                message.style.color = "red";
                message.innerText = "خطأ في قراءة البيانات: " + error.message;
            });

        })
        .catch((error) => {
            message.style.color = "red";
            message.innerText = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
        });
}
