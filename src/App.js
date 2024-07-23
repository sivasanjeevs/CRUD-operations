
import { useEffect, useState } from 'react';
import './App.css';
import { Button, EditableText, InputGroup, Toaster} from '@blueprintjs/core';

const apptoster =Toaster.create({
  position: "top"
})

function App() {
  const [users, setusers] = useState([]);
  const [newname, setnewname] = useState([]);
  const [newemail, setnewemail] = useState([]);
  const [newweb, setnewweb] = useState([]);


  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(json => setusers(json))
  },[])




  function adduser () {
    const name = newname.trim();
    const email = newemail.trim();
    const website = newweb.trim();

    if( name && email && website){
      fetch('https://jsonplaceholder.typicode.com/users',
        {
          method: "POST",
          body: JSON.stringify({
            name,
            email,
            website
          }),
          headers: {
            "content-type": "application/json; charset=UTF-8"
          }
        }
      ).then((response) => response.json())
      .then(data =>{
        setusers([...users,data]);
        apptoster.show({
          message: "user added successfully",
          intent: 'success',
          timeout: 3000
        })
        setnewname("");
        setnewemail("");
        setnewweb("");
      })

    }
  }

  function onchangehandler(id, key, value){
    setusers((users)=>{
      return users.map(user => {
        return user.id === id ? {...user,[key]: value}: user;
      })
    })
  }

  function updateuser (id) {
    const user = users.find((user) => user === id );

    fetch(`https://jsonplaceholder.typicode.com/users/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(user),
          headers: {
            "content-type": "application/json; charset=UTF-8"
          }
        }
      ).then((response) => response.json())
      .then(data =>{
        apptoster.show({
          message: "updated successfully",
          intent: 'success',
          timeout: 3000
        })
      })
  }

  function deleteuser (id) {
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`,
        {
          method: "DELETE",
        }
      ).then((response) => response.json())
      .then(data =>{
        setusers((users) => {
          return users.filter(user => user.id !== id)
        } )
        apptoster.show({
          message: "DELETED successfully",
          intent: 'success',
          timeout: 3000
        })
      })
  }

  return (
    <div className="App">
      <table className='bp4-html-table modifier'>
        <thead>
          <th>ID</th>
          <th>NAME</th>
          <th>EMAIL</th>
          <th>WEBSITE</th>
          <th>ACTION</th>
        </thead>
        <tbody>
          {users.map(user =>
             <tr key={user.id}>
             <td><EditableText  value={user.id}/></td>
             <td><EditableText value={user.name}/></td>
             <td><EditableText onChange={value =>onchangehandler(user.id, 'email', value)} value={user.email}/></td>
             <td><EditableText onChange={value =>onchangehandler(user.id, 'website', value)} value={user.website}/></td>
             <td>
              <button intent='primary' onClick={() => updateuser(user.id)}>update</button>

              <button intent='danger'onClick={() => deleteuser(user.id)}>delete</button>
             </td>
           </tr>

          )}
         
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>
              <InputGroup
              value={newname}
              onChange={(e) => setnewname(e.target.value)}
              placeholder='enter name...'
              />
            </td>
            <td>
              <InputGroup
              value={newemail}
              onChange={(e) => setnewemail(e.target.value)}
              placeholder='enter email...'
              />
            </td>
            <td>
              <InputGroup
              value={newweb}
              onChange={(e) => setnewweb(e.target.value)}
              placeholder='enter website...'
              />
            </td>
            <td>
              <button intent='success' onClick={adduser}>add user</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
