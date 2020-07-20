var currentPage = document.getElementById("info-page") // currently opened page
var currentPrompt // currently opened prompt
var currentlyBlurred // currently blurred page

/**
 * Event function used to change pages.
 * @param {Event} event
 */
function changePage(event) {
    var pageName = event.srcElement.getAttribute("data-page-link")
    var newPage = document.getElementById(pageName)
    currentPage.style.display = "none"
    newPage.style.display = "flex"
    currentPage = newPage
}

/**
 * Used to go to a specific page
 * @param {string} pageName 
 */
function goToPage(pageName) {
    var newPage = document.getElementById(pageName)
    currentPage.style.display = "none"
    newPage.style.display = "flex"
    currentPage = newPage
}

// Adds an event listener to each tab that will change the page and closes any opened prompt
document.querySelectorAll(".tab").forEach((element) => {
    element.addEventListener('click', (event) => {
        changePage(event)
        if (currentPrompt != null && currentPrompt != undefined) {
            currentPrompt.classList.remove("prompt")
            currentlyBlurred.style.filter = ""
            currentPrompt = null
            currentlyBlurred = null
        }
    })
})

export { goToPage, currentPrompt, currentlyBlurred }