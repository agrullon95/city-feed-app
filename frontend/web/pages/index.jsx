import Feed from "../components/Feed";

export default function Home() {
    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px'}}>
            <h1>App Home</h1>
            <Feed />
        </div>
    )
}