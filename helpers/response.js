exports.success = (message, data, code = 200, version = '1.0') => {
    return ({
        success: true,
        message: message,
        data: data,
        code: code,
        version: version 
    })
}

exports.error = (message, code = 400, version = '1.0') => {
    return ({
        success: true,
        message: message,
        data: null,
        code: code,
        version: version 
    })
}
