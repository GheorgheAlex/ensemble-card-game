import { render } from "react-dom";
import MainPage from "./MainPage";

test("App interface should be rendered", () =>{
    render(<MainPage/>)
    const headerElem = screen.getByClassName("header")
    expect(headerElem).toBeInTheDocument
})