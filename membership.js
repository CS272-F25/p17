
// Botton modal interactivity 

function modalInteraction (openButton, modalId, closeButton){
    const openModalButton = document.getElementById(openButton); 
    const modalContainer = document.getElementById(modalId);
    const closeModalButton = document.getElementById(closeButton);
    const overlayDisplay = document.querySelector(".overlay");

    openModalButton.addEventListener("click", () => {
        modalContainer.classList.add("show"); 
        overlayDisplay.style.display = "flex";

    });

    closeModalButton.addEventListener("click", () => {
        modalContainer.classList.remove("show");
        overlayDisplay.style.display = "none";
    }); 
}

modalInteraction("goals_button", "goals_modal_container", "close_goals");
modalInteraction("what_we_do_button", "what_we_do_modal_container", "close_what_we_do");
modalInteraction("rights_button", "rights_modal_container", "close_rights");
modalInteraction("president_button", "president_modal_container", "close_president");
modalInteraction("secretary_button", "secretary_modal_container", "close_secretary");
modalInteraction("finance_button", "finance_modal_container", "close_finance");
modalInteraction("marketing_button", "marketing_modal_container", "close_marketing");
modalInteraction("programming_button", "programming_modal_container", "close_programming");

// End of button modal interactivity 


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
            thankYouForSubmission.style.color = "white";
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

















