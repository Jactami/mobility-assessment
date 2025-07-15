export function useLegal() {
  return { getCompanyData }
}

function getCompanyData() {
  return {
    name: 'Bayerische Gesellschaft für Wohneigentum – Digital mbH & Co. KG',
    address: 'Luitpoldstraße 53, 96052 Bamberg',
    email: 'info@bgw-digital.de',
    phone: '+49 951 51954-0',
    web: 'www.bgw-digital.de',
  }
}
