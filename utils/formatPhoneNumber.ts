export const formatPhoneNumber = (phoneNumber: string) => {
  let phoneString = phoneNumber.toString()
  let formattedPhone = phoneString.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
  return formattedPhone
}
