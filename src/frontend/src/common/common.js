export function hideSpinner(id){
    const spinnerEl = document.getElementById(id)
    
    if (spinnerEl){
        spinnerEl.innerHTML = ""
    }
}