// ======================
// Google Apps Script API
// ======================

const API_URL =
"https://script.google.com/macros/s/AKfycbwkH4Wcby-clYLI9yzCClYLXdiGGq2KnB0tJ5Gte5Rkmy0ObbMFO92zx_rzzXPhdUdYIw/exec";


// ======================
// 登入
// ======================

async function login(){

    const account =
        document.getElementById("loginAccount").value.trim();

    const password =
        document.getElementById("loginPassword").value.trim();

    if(!account){

        alert("請輸入帳號");
        return;

    }

    if(!password){

        alert("請輸入密碼");
        return;

    }

    try{

        const response =
            await fetch(API_URL,{

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    action:"login",

                    account:account,

                    password:password

                })

            });

        const result =
            await response.json();

        if(result.success){

            localStorage.setItem(
                "temple",
                result.temple
            );

            localStorage.setItem(
                "name",
                result.name
            );

            localStorage.setItem(
                "loginTime",
                new Date().toLocaleString("zh-TW")
            );

            location.href="home.html";

        }else{

            alert("帳號或密碼錯誤");

        }

    }catch(error){

        console.error(error);

        alert("系統連線失敗");

    }

}


// ======================
// 載入壇名
// ======================

async function loadTemple(group){

    try{

        const response =
            await fetch(API_URL,{

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    action:"getTemple",

                    group:String(group)

                })

            });

        const list =
            await response.json();

        const templeSelect =
            document.getElementById("temple");

        templeSelect.innerHTML="";

        if(list.length===0){

            templeSelect.innerHTML=
                "<option>查無壇名</option>";

            return;

        }

        list.forEach(item=>{

            const option =
                document.createElement("option");

            option.value=item;

            option.textContent=item;

            templeSelect.appendChild(option);

        });

    }catch(error){

        console.error(error);

        alert("讀取壇名失敗");

    }

}


// ======================
// 申請帳號
// ======================

async function registerAccount(){

    const group =
        document.querySelector(
            'input[name="group"]:checked'
        );

    if(!group){

        alert("請先選擇組別");
        return;

    }

    const temple =
        document.getElementById("temple").value;

    const name =
        document.getElementById("name").value.trim();

    const account =
        document.getElementById("account").value.trim();

    const password =
        document.getElementById("password").value.trim();

    if(!temple){

        alert("請選擇壇名");
        return;

    }

    if(!name){

        alert("請輸入姓名");
        return;

    }

    if(!account){

        alert("請輸入帳號");
        return;

    }

    if(!password){

        alert("請輸入密碼");
        return;

    }

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailPattern.test(account)){

        alert("Email格式錯誤");
        return;

    }

    const mobilePattern =
        /^[1-9][0-9]{8}$/;

    if(!mobilePattern.test(password)){

        alert(
            "密碼需輸入9碼手機號碼（不含開頭0）"
        );

        return;

    }

    try{

        const response =
            await fetch(API_URL,{

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    action:"register",

                    group:group.value,

                    temple:temple,

                    name:name,

                    account:account,

                    password:password

                })

            });

        const result =
            await response.json();

        alert(result.message);

        if(result.success){

            location.href="index.html";

        }

    }catch(error){

        console.error(error);

        alert("系統連線失敗");

    }

}


// ======================
// 登出
// ======================

function logout(){

    localStorage.removeItem("temple");

    localStorage.removeItem("name");

    localStorage.removeItem("loginTime");

    location.href="index.html";

}