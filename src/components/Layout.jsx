import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {

    return (

        <div className="d-flex">

            <Sidebar />

            <div className="flex-grow-1">

                <Navbar />

                <main
                    className="p-4"
                    style={{
                        background: "#f5f6fa",
                        minHeight: "100vh"
                    }}
                >
                    {children}
                </main>

            </div>

        </div>

    );

}

export default Layout;