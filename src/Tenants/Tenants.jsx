
import React, {useState, useEffect} from "react";
import styles from "./Tenants.module.css";

function Tenants(){

    const [idNumber, setIDNumber] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [fisrtName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [entryDate, setEntryDate] = useState("");
    const [roomNumber, setRoomNumber] = useState("");
    const [gender, setGender] = useState("");
    const [monthlyCharges, setMonthlyCharges] = useState("");

    const [editIndex, setEditIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResult, setSearchResult] = useState(null);


    const [myTenants, setMyTenants] = useState(JSON.parse(localStorage.getItem("20251110MYTenants")) || []);
    useEffect(()=>{
        localStorage.setItem("20251110MYTenants", JSON.stringify(myTenants));
        console.log(myTenants);
    }, [myTenants]);

    function handleIDNumber(event){
        setIDNumber(event.target.value);
    }
    function handlePhoneNumber(event){
        setPhoneNumber(event.target.value);
    }
    function handleFirstName(event){
        setFirstName(event.target.value);
    }
    function handleLastName(event){
        setLastName(event.target.value);
    }
    function handleEntryDate(event){
        setEntryDate(event.target.value);
    }
    function handleRoomNumber(event){
        setRoomNumber(event.target.value);
    }
    function handletGender(event){
        setGender(event.target.value);
    }
    function handleMonthlyCharges(event){
        setMonthlyCharges(event.target.value);
    }

    function handleAddCustomer(event){
        event.preventDefault();
        if(idNumber.length !== 8){
            window.alert("Enter valid ID number");
        }
        else if(!(phoneNumber.startsWith(254)) || phoneNumber.length !== 12){
            window.alert("Phone must start with '254' ");
        }
        else if(fisrtName.length < 3 || lastName.length < 3){
            window.alert("Enter valid name");
        }
        else if(Number(monthlyCharges) < 6000){
            window.alert("Enter valid Rent amount");
        }
        else{
            const newCustomer = {
                idNumber: idNumber, phoneNumber: phoneNumber ,fisrtName: fisrtName, lastName: lastName,
                entryDate: entryDate, roomNumber: roomNumber, gender: gender, monthlyCharges: monthlyCharges
            }

            if(editIndex !== null){
                const updatedTenants = [...myTenants];
                updatedTenants[editIndex] = newCustomer;
                setMyTenants(updatedTenants);
                setEditIndex(null);
                window.alert("Tenant details updated successfully!");
            }

            else{

                const isDuplicate = myTenants.some((tenant) => 
                    tenant.idNumber === idNumber || tenant.phoneNumber === phoneNumber
                );

                if(isDuplicate){
                window.alert("A tenant with this ID or phone number already exists!");
                }
                else{
                    setMyTenants(t => [...t, newCustomer]);
                    window.alert("Tenant added successfully!")
                }
            }
            

        }
    }

    function handleEditTenant(index){
        const tenantToEdit = myTenants[index];

        setIDNumber(tenantToEdit.idNumber);
        setPhoneNumber(tenantToEdit.phoneNumber);
        setFirstName(tenantToEdit.fisrtName);
        setLastName(tenantToEdit.lastName);
        setEntryDate(tenantToEdit.entryDate);
        setRoomNumber(tenantToEdit.roomNumber);
        setGender(tenantToEdit.gender);
        setMonthlyCharges(tenantToEdit.monthlyCharges);

        setEditIndex(index);

    }

    function deleteCustomer(index){
        const confirmDelete = window.confirm("Are you sure you want to delete this tenant?");

        if(confirmDelete){
            const updatedCustomers = myTenants.filter((tenant, i) => index !== i);
            setMyTenants(updatedCustomers);
            window.alert("Tenant deleted successfully");
        }
        else{
            window.alert("Deletion Cancelled");
        }
        
    }

    return(
        <div className={styles.container} >
            <form className={styles.myForm} onSubmit={handleAddCustomer} >
                <input type="number" placeholder="ID Number" value={idNumber} onChange={handleIDNumber} required/><br/>
                <input type="number" placeholder="Phone Number" value={phoneNumber} onChange={handlePhoneNumber} required/><br/>
                <input type="text" placeholder="First Name" value={fisrtName} onChange={handleFirstName} required/><br/>
                <input type="text" placeholder="Last Name" value={lastName} onChange={handleLastName} required /><br />
                <input type="date" value={entryDate} onChange={handleEntryDate} required /><br/>
                <input type="text" placeholder="Room Number" value={roomNumber} onChange={handleRoomNumber} required /><br />
                <div>
                    <input value="Male" type="radio" name="gender" checked={gender === "Male"} onChange={handletGender} required />
                    <label>Male</label>
                    <input value="Female" type="radio" name="gender" checked={gender === "Female"} onChange={handletGender} required />
                    <label>Female</label> <br />
                </div>
                <input type="number" placeholder="Monthly Charges" value={monthlyCharges} onChange={handleMonthlyCharges} required /><br />
                <button type="submit" >Add Customer</button>

            </form>
            <table className={styles.myTable} >
                <thead>
                    <tr>
                        <th>ID Number</th>
                        <th>Phone Number</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Entry Date</th>
                        <th>Room Number</th>
                        <th>Gender</th>
                        <th>Monthly Charges</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>

                <tbody>
                    {myTenants.map((tenant, index) => 
                    <tr key={index}>
                        <td>{tenant.idNumber} </td>
                        <td>{tenant.phoneNumber} </td>
                        <td>{tenant.fisrtName} </td>
                        <td>{tenant.lastName} </td>
                        <td>{tenant.entryDate} </td>
                        <td>{tenant.roomNumber} </td>
                        <td>{tenant.gender} </td>
                        <td>{tenant.monthlyCharges} </td>
                        <td><button onClick={()=> handleEditTenant(index)} >Edit</button> </td>
                        <td><button onClick={()=>deleteCustomer(index)} >Delete</button></td>
                    </tr>
                    )}
                </tbody>

            </table>
        </div>
    );
}
export default Tenants;

