const env = {
    appwrite: {
        projectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
        endpoint: String(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT),
        apiKey: String(process.env.APPWRITE_API_KEY)
    }
}

export default env