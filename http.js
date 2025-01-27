const axios = require("axios")
const { HttpsProxyAgent } = require("https-proxy-agent")

export class HttpService {
    constructor(cookie = null, proxy = null) {
        this.baseURL = [
            "https://www.facebook.com/api/graphql/",
            "https://www.facebook.com/"
        ] // danh sách các url cần dùng cho API
        this.proxy = proxy // khởi tạo proxy
        this.cookie = cookie // khởi tạo cookie
        this.headers = {
            'origin': 'https://www.facebook.com'
        } // khởi tạo headers mặc định cho các payload
    }

    initConfig() { // config trước khi gửi dữ liệu đi
        const headers = { ...this.headers } // sao chép headers từ this.headers

        if (this.cookie) { // nếu có cookie thêm cookie vào headers 
            headers["cookie"] = this.cookie
        }

        const config = { headers } // khởi tạo config
        if (this.proxy && this.proxy !== "") { // nếu có proxy và proxy không phải skip thì tạo 1 proxy và lưu vào config
            config["httpsAgent"] = new HttpsProxyAgent(this.proxy)
        }

        return config // trả lại config
    }

    async get(domain, endPoint) {
        try {
            const url = this.baseURL[domain] + endPoint // https://facebook.com
            const config = this.initConfig() // khởi tạo config trước khi gọi api
            return await axios.get(url, config) // gọi API và trả về kết qua
        } catch (err) {
            throw new Error(`GET request failed ${err.message}`)
        }
    }

    async post(domain, endPoint, body) {
        try {
            const url = this.baseURL[domain] + endPoint // https://facebook.com
            const config = this.initConfig() // khởi tạo config trước khi gọi api
            return await axios.post(url, body, config) // gọi API và trả về kết qua
        } catch (err) {
            throw new Error(`POST request failed ${err.message}`)
        }
    }

    async put(domain, endPoint, body) {
        try {
            const url = this.baseURL[domain] + endPoint  // https://facebook.com
            const config = this.initConfig()  // khởi tạo config trước khi gọi api
            return axios.put(url, body, config) // gọi API và trả về kết qua
        } catch (err) {
            throw new Error(`PUT request failed ${err.message}`)
        }
    }

    async customHTTPGet(url) {
        try {
            const config = this.initConfig()  // khởi tạo config trước khi gọi api
            return axios.get(url, config) // gọi API và trả về kết qua
        } catch (err) {
            throw new Error(`custom get http request failed ${err.message}`)
        }
    }

    async checkProxyIP() {
        if (!this.proxy || this.proxy === "skip") return null
        try {
            const proxyAgent = new HttpsProxyAgent(this.proxy)
            const response = await axios.get("https://api.ipify.org?format=json", {
                httpsAgent: proxyAgent,
            })

            if (response.status === 200) {
                return response.data.ip
            } else {
                throw new Error("proxy error")
            }
        } catch (error) {
            console.error(`proxy check failed ${error.message}`)
            return -1
        }
    }
}

module.exports = new HttpService()
