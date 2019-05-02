
const getLocalStorageToken = () => {
    const token  = localStorage.getItem('token') ? localStorage.getItem('token') : '';

    return token
}

export default getLocalStorageToken