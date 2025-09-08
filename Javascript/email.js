export function sendConfirmationEmail(user){
    let params = {
        name: user.displayName || user.email,
        email: user.email
    }

    const serviceID = "service_pf05mmd";
    const templateID = "template_hwjjoo4";

    emailjs.send(serviceID, templateID, params)
        .then(res=>{
            console.log("success");
        })
        .catch(error=>{console.log(error)});
}