 
import styles from "./Rooms.module.css";
import React, {useState, useEffect} from "react";

function Rooms(){

    const [myRooms, setMyRooms] = useState(JSON.parse(localStorage.getItem("20251112MyRooms")) || []);
    const [myTenants, setMyTenants] = useState(JSON.parse(localStorage.getItem("20251110MYTenants")) || []);

    useEffect(()=>{
        localStorage.setItem("20251112MyRooms", JSON.stringify(myRooms));
        console.log(myRooms);
        console.log(myTenants);
    }, [myRooms]);

    const [roomNumber, setRoomNumber] = useState("");
    const [floorNumber, setFloorNumber] = useState("");
    const [sharingType, setSharingType] = useState("");
    const [gender, setGender] = useState("");
    const [monthlyCharges, setMonthlyCharges] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResult, setSearchResult] = useState(null); 
    const [editIndex, setEditIndex] = useState(null);
    

    function handleRoomNumber(event){
        setRoomNumber(event.target.value);
    }
    function handleFloorNumber(event){
        setFloorNumber(event.target.value);
    }
    function handleSharingType(event){
        setSharingType(event.target.value);
    }
    function handleGender(event){
        setGender(event.target.value);
    }
    function handleMonthlyCharges(event){
        setMonthlyCharges(event.target.value);
    }
    function handleSearchTerm(event){
        setSearchTerm(event.target.value);
    }

    function handleSearch(){
        const foundRoom = myRooms.find((room) => room.RoomNumber === searchTerm);

        if(!foundRoom){
            window.alert("No Such Room !");
        }
        else if(foundRoom){
            setSearchResult(foundRoom);
        }
    }

    function handleReset(){
        setSearchTerm("");
        setSearchResult(null);
    }

    function handleEdit(index){

        const roomToEdit = myRooms[index];

        setRoomNumber(roomToEdit.RoomNumber);
        setFloorNumber(roomToEdit.FloorNumber);
        setSharingType(roomToEdit.SharingType);
        setGender(roomToEdit.Gender);
        setMonthlyCharges(roomToEdit.MonthlyCharges);
        
        setEditIndex(index);
    }

    function handleDelete(index){
        const confirmDelete = window.confirm("Confirm you want to delete this room");
        if(!confirmDelete){
            window.alert("Deletion cancelled");
        }
        else if(confirmDelete){
            const updatedRooms = myRooms.filter((room , i) => index !== i);
            setMyRooms(updatedRooms);
            window.alert("Deleted successfully");
        }
    }

    function handleAddRoom(event){
        event.preventDefault();

        const myRoom = {RoomNumber: roomNumber, FloorNumber: floorNumber, SharingType: sharingType,
            Gender: gender, MonthlyCharges: monthlyCharges, 
        }

        if(editIndex !== null){
            const updatedRooms = [...myRooms];
            updatedRooms[editIndex] = myRoom;
            setMyRooms(updatedRooms);
            window.alert("Room Edited Successfully");
            setEditIndex(null);
            resetFormFields();
        }

        else if(editIndex === null){
            const isDuplicate = myRooms.some((room) => room.RoomNumber === roomNumber);
            if(isDuplicate){
                window.alert("The room already exists !");
            }
            else if(!isDuplicate){
                setMyRooms([...myRooms, myRoom]);
                window.alert("Room added successfully !");
                resetFormFields();
            }
        }

        
    }

    function resetFormFields(){
        setRoomNumber("");
        setFloorNumber("");
        setSharingType("");
        setGender("");
        setMonthlyCharges("");
    }
    return(
        <div className={styles.myContainer} >
            <form className={styles.myForm} onSubmit={handleAddRoom} >
                <input type="text" placeholder="Enter Room Number" value={roomNumber} onChange={handleRoomNumber} required/>
                <select required value={floorNumber} onChange={handleFloorNumber}>
                    <option value="">Select the Floor</option>
                    <option value="Ground Floor" >Ground Floor</option>
                    <option value="First Floor" >First Floor</option>                   
                </select>
                <select required value={sharingType} onChange={handleSharingType}>
                    <option value="" >Type of Sharing</option>
                    <option value="2" >2</option>
                    <option value="4" >4</option>
                    <option value="6" >6</option>
                    <option value="8" >8</option>
                </select>
                <div>
                    <input value="Male" type="radio" name="gender" onChange={handleGender} checked={gender === "Male"} required />
                    <label>Male</label> <br/>
                    <input value= "Female" type="radio" name="gender" onChange={handleGender} checked={gender === "Female"} required />
                    <label>Female</label>
                </div>
                <select required value={monthlyCharges} onChange={handleMonthlyCharges} >
                    <option value="" >Monthly Charges</option>
                    <option value="9,500" >9,500</option>
                    <option value= "9,000" >9,000</option>
                    <option value= "8,500" >8,500</option>
                    <option value= "8,000" >8,000</option>
                    <option value= "7,500" >7,500</option>
                    <option value= "7,000" >7,000</option>
                </select>
                <button type="submit">Add Room</button>
            </form>

            <div className= {styles.searchTab} >
                <input type="text" placeholder="Enter Room Number" value={searchTerm} onChange={handleSearchTerm} />
                <button className={styles.searchButton} onClick={handleSearch} >Search</button>
                <button className={styles.resetButton} onClick={handleReset} >Reset</button>
            </div>

            <table className={styles.myTable}>
                <thead>
                    <tr>
                        <th>Room Number</th>
                        <th>Floor Number</th>
                        <th>Sharing Type</th>
                        <th>Gender</th>
                        <th>Monthly Charges</th>
                        <th>Vacancy</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {(searchResult ? [searchResult] : myRooms)?.map((room, index)=>{
                        const roomIndex = myRooms.findIndex((r)=> r.RoomNumber === room.RoomNumber );
                        const roomCapacity = room.SharingType;
                        const occupied = myTenants.filter((tenant)=> tenant.RoomNumber === room.RoomNumber).length;
                        const remaining = roomCapacity - occupied;
                    return(<tr key={index} >
                        <td>{room.RoomNumber} </td>
                        <td>{room.FloorNumber} </td>
                        <td>{room.SharingType} Sharing </td>
                        <td>{room.Gender} </td>
                        <td>{room.MonthlyCharges} </td>
                        <td>{remaining > 0 ? `${remaining} Slots` : "Full" }</td>
                        <td><button className={styles.editButton} onClick={() => handleEdit(roomIndex)} >Edit</button></td>
                        <td><button className={styles.deleteButton} onClick={()=> handleDelete(roomIndex)} >Delete</button></td>
                    </tr>)})}
                </tbody>
            </table>
        </div>
    );
}
export default Rooms;
