document.getElementById("registerForm").addEventListener("submit", async function(e){

e.preventDefault();

const data = {
name: document.getElementById("name").value,
age: document.getElementById("age").value,
weight: document.getElementById("weight").value,
experience: document.getElementById("experience").value,
email: document.getElementById("email").value
};

const response = await fetch("/register",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(data)
});

if(response.ok){
window.location.href="success.html";
}else{
alert("Registration Failed");
}

});