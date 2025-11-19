// Start of goals, what we do, and rights clickable buttons
const goalsButton = document.getElementById("goals_button"); 
const goalsList = document.getElementById("membership_goals_list"); 
const whatWeDoButton = document.getElementById("what_we_do_button"); 
const whatWeDoList = document.getElementById("membership_what_we_do_list"); 
const rightsButton = document.getElementById("rights_button"); 
const rightsList = document.getElementById("membership_rights_list"); 


goalsButton.addEventListener("click", () => {
    if(goalsList.className === "d-none"){
        goalsList.className = "membership_info_lists"; 
    }

    else {
        goalsList.className = "d-none"; 
    }
})



whatWeDoButton.addEventListener("click", () => {
    if(whatWeDoList.className === "d-none"){
        whatWeDoList.className = "membership_info_lists";
    }

    else{
        whatWeDoList.className = "d-none";
    }
})

rightsButton.addEventListener("click", () => {
    if(rightsList.className === "d-none"){
        rightsList.className = "membership_info_lists"; 
    }

    else {
        rightsList.className = "d-none"; 
    }
})
// End of goals, what we do, and rights clickable buttons


// Start of Membership form functionality 
const membershipFormSubmissionButton = document.getElementById("submit_button"); 
const membershipForm = document.getElementById("membership_form"); 
const membershipFormDiv = document.getElementById("membership_form_div");
const thankYouForSubmission = document.createElement("p");
const errorText = document.createElement("p");   
const prospectiveMemberName = document.getElementById("name"); 
const prospectiveMemberEmail = document.getElementById("email")


membershipFormSubmissionButton.addEventListener("click", () => {
    if(prospectiveMemberName.value === "" || prospectiveMemberEmail.value === ""){ 
        errorText.innerText = "Please input your full name and email address to complete the form"; 
        errorText.style.color = "white"; 
        membershipFormDiv.appendChild(errorText); 
    }

    else {
        errorText.innerText = ""; 

        if (membershipForm.className === "d-flex"){
            membershipForm.className = "d-none";
            thankYouForSubmission.innerText = `Thank you for your membership form, ${prospectiveMemberName.value}. We will be in contact soon!`; 
            membershipFormDiv.appendChild(thankYouForSubmission); 
            membershipFormSubmissionButton.innerText = "Submit another form"; 
    }

        else {
            membershipForm.className = "d-flex"; 
            membershipFormSubmissionButton.innerText = "Submit"; 
            thankYouForSubmission.innerText = ""; 
    }
    }
})
// End of membership form functionality 

// Leadership options functionality start 

const presidentButton = document.getElementById("president_button"); 
const presidentResponsibilities = document.getElementById("president_responsibility_list"); 
const presidentImage = document.getElementById("president_image"); 


presidentButton.addEventListener("click", () => {
    if(presidentResponsibilities.className === "d-none"){
        presidentResponsibilities.className = "d-flex responsibilities_lists"; 
        presidentImage.className = "d-none"; 
    }
    else {
        presidentResponsibilities.className = "d-none" 
        presidentImage.className = "d-flex m-4 leadership_images"; 
    }
}) 

const secretaryButton = document.getElementById("secretary_button"); 
const secretaryResponsibilities = document.getElementById("secretary_responsibility_list"); 
const secretaryImage = document.getElementById("secretary_image"); 


secretaryButton.addEventListener("click", () => {
    if(secretaryResponsibilities.className === "d-none"){
        secretaryResponsibilities.className = "d-flex responsibilities_lists"; 
        secretaryImage.className = "d-none"; 
    }
    else {
        secretaryResponsibilities.className = "d-none" 
        secretaryImage.className = "d-flex m-4 leadership_images"; 
    }
}) 


const financeButton = document.getElementById("finance_button"); 
const financeResponsibilities = document.getElementById("finance_responsibility_list"); 
const financeImage = document.getElementById("finance_image"); 


financeButton.addEventListener("click", () => {
    if(financeResponsibilities.className === "d-none"){
        financeResponsibilities.className = "d-flex responsibilities_lists"; 
        financeImage.className = "d-none"; 
    }
    else {
       financeResponsibilities.className = "d-none" 
        financeImage.className = "d-flex m-4 leadership_images"; 
    }
}) 


const marketingButton = document.getElementById("marketing_button"); 
const marketingResponsibilities = document.getElementById("marketing_responsibility_list"); 
const marketingImage = document.getElementById("marketing_image"); 


marketingButton.addEventListener("click", () => {
    if(marketingResponsibilities.className === "d-none"){
        marketingResponsibilities.className = "d-flex responsibilities_lists"; 
        marketingImage.className = "d-none"; 
    }
    else {
        marketingResponsibilities.className = "d-none" 
        marketingImage.className = "d-flex m-4 leadership_images"; 
    }
}) 

const programmingButton = document.getElementById("programming_button"); 
const programmingResponsibilities = document.getElementById("programming_responsibility_list"); 
const programmingImage = document.getElementById("programming_image"); 


programmingButton.addEventListener("click", () => {
    if(programmingResponsibilities.className === "d-none"){
        programmingResponsibilities.className = "d-flex responsibilities_lists"; 
        programmingImage.className = "d-none"; 
    }
    else {
        programmingResponsibilities.className = "d-none" 
        programmingImage.className = "d-flex m-4 leadership_images";
    }
}) 












