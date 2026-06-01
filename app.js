// دالة إنشاء حساب جديد (مدير)
function registerUser() {
    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
    const message = document.getElementById("message");

    if(!name || !email || !password) {
        message.innerText = "يرجى تعبئة جميع الحقول أولاً.";
        return;
    }

    message.style.color = "#2563eb"; // لون أزرق
    message.innerText = "جاري إنشاء الحساب وإعداد قاعدة البيانات...";

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            // الكود العبقري: إضافة البيانات تلقائياً للـ Firestore
            db.collection("Users").doc(user.uid).set({
                name: name,
                email: email,
                role: "admin" // تحديد الصلاحية كمدير تلقائياً
            }).then(() => {
                message.style.color = "#10b981"; // لون أخضر
                message.innerText = "تم التسجيل بنجاح! جاري توجيهك...";
                // توجيه مباشر للوحة التحكم
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
