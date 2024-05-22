import "./Modal.css";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormEvent } from "react";
//TODO:
//Need to handle submit
//Need to think about passing room state down from App.tsx

interface funcProp {
 toggleModal(): void;
}

export const Modal: React.FC<funcProp> = ({ toggleModal }) => {
//  const navigate = useNavigate();

 const [inputValue, setInputValue] = useState("");

 const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
  e.preventDefault();

  const newValue = e.target.value;

  if (/^\d{0,4}$/.test(newValue)) {
   setInputValue(newValue);
   // setRoom(newValue)
  }
 };

 const handleSubmit = (e: FormEvent<HTMLInputElement>): void => {
  e.preventDefault();
  // if (inputValue.length === 4) {
	// 	navigate("/lobby")
  // }
 };

 return (
  <div className="modal">
   <div className="overlay"></div>
   <div className="modal-content">
    <h2>Enter the 4 digit lobby ID.</h2>
    <form>
     <label>
      You can join a private lobby by filling in the four-digit lobby ID
      <input
       type="text"
       onChange={handleInputChange}
       value={inputValue}
       placeholder="Lobby ID..."
      />
     </label>
     <button type="submit">Join Lobby</button>
    </form>
    <button className="close-modal" onClick={toggleModal}>
     X
    </button>
   </div>
  </div>
 );
};

export default Modal;
