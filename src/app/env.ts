const env = {
    appwrite: {
        projectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
        endpoint: String(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT),
        apiKey: String(process.env.APPWRITE_API_KEY),
        devKey: String(process.env.APPWRITE_DEV_KEY)
    },
    nodeEnv: String(process.env.NODE_ENV)
}

export default env