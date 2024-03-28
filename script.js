const currencySelectors = document.getElementsByClassName('selector')
const form = document.querySelector('form')
const button = document.querySelector('#currencyButton')
const pairLabel = document.querySelector('#pair-label')
const output = document.querySelector('#output')
const outputBox = document.querySelector('#rate-box')

async function init() {

    const currencyArray = await getCurrencyCategories()

    setSelectorOptions(currencySelectors[0], currencyArray, "nothing")
    setSelectorOptions(currencySelectors[1], currencyArray, "EUR")

    currencySelectors[0].addEventListener('input', event => {
        const exclude = currencySelectors[0].value
        setSelectorOptions(currencySelectors[1], currencyArray, exclude)
    })

    form.addEventListener('submit', getCurrencyRates)
}

init()

async function getCurrencyRates(event) {
    event.preventDefault()
    button.setAttribute('disabled', true)
    button.textContent = "Loading..."

    const firstCurrency = currencySelectors[0].value
    const secondCurrency = currencySelectors[1].value

    const resPromise = await fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_vM1q8zaHUeFCbu2Rk7wMpnDyDf2fqxrm3pQ0WQt1&currencies=${secondCurrency}&base_currency=${firstCurrency}`)
    const jsonPromise = await resPromise.json()
    const rate = jsonPromise.data[secondCurrency]

    outputBox.style.display = "flex"
    pairLabel.textContent = `${firstCurrency}/${secondCurrency}`
    output.textContent = rate

    button.removeAttribute('disabled')
    button.textContent = "Get Exchange Rate"
}

async function getCurrencyCategories() {
    const promiseRes = await fetch('https://api.freecurrencyapi.com/v1/currencies?apikey=fca_live_vM1q8zaHUeFCbu2Rk7wMpnDyDf2fqxrm3pQ0WQt1&currencies=&base_currency=EUR')
    const promiseJson = await promiseRes.json()
    const currencyArray = Object.keys(promiseJson.data)

    button.removeAttribute('disabled')

    return currencyArray
}

function setSelectorOptions(selector, options, exclude) {

    selector.innerHTML = ""

    options.forEach(element => {
        if (element != exclude) {
            const optionElement = document.createElement('option')
            optionElement.setAttribute('id', element)
            optionElement.setAttribute('value', element)
            optionElement.textContent = element
            selector.appendChild(optionElement)
        }
    });
}