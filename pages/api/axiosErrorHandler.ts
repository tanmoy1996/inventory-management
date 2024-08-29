function handleApiError(error: any) {
  if (error.response && error.response.status === 401) {
    localStorage.clear()
    // signOut({ redirect: false }).then(() => {
    //   window.location.href = "/";
    // });
  } else if (error.response) {
    // The request was made and the server responded with a status code
    console.error('Response error:', error.response.status, error.response.data)
    return Promise.reject(error.response.data)
  } else if (error.request) {
    // The request was made but no response was received
    console.error('Request error:', error.request)
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error:', error.message)
  }
  return Promise.reject('An error occurred')
}

export default handleApiError
