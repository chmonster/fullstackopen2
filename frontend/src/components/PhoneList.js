const Notification = ({message, messageType}) => (
    message === null ? null : <div className={messageType}>{message}</div>
)
  
const Header = ({title}) => <h1>{title}</h1>

const PhoneEntries = ({list, deleteHandler}) => (
<ul>
    {list.map(entry => 
        <PhoneEntry key={entry.id} name={entry.name} number={entry.number} 
            id = {entry.id} deleteHandler={deleteHandler}/> 
    )}
</ul>
)

const PhoneEntry = ({name, number, id, deleteHandler}) => 
    <> <li>{name} : {number}</li> <DeleteButton handler={() => deleteHandler(id, name)} /> </>


const InputBlock = ({label, value, handler}) => 
    <> {label}: <input value = {value} onChange = {handler} /> </>


const InputForm = ({onSubmit, input1, handler1, input2, handler2}) => (
    <form onSubmit={onSubmit}>
        <InputBlock key = 'nameinput' label = 'name' value = {input1} handler = {handler1} />
        <br />
        <InputBlock key = 'numberinput' label = 'number' value = {input2} handler = {handler2} />
        <button type="submit">add</button>
    </form> 
)

const DeleteButton = ({handler}) => <> <button onClick={handler}>delete</button> </>

const PhoneList = ({message, messageType, 
                    search, handleSearch, 
                    addEntry,
                    newName, handleNameChange,
                    newNumber, handleNumberChange,
                    personsFiltered, deleteEntry
                    }) => (
    <div>
        <Notification message={message} messageType={messageType} />
        <Header key='header' title='Phonebook' />
        <InputBlock key = 'searchinput' label = 'search' 
            value = {search} handler = {handleSearch} />
        <Header key='addnewlisting' title='Add New Listing' />
        <InputForm onSubmit = {addEntry} 
            input1 = {newName} handler1 = {handleNameChange}
            input2 = {newNumber} handler2 = {handleNumberChange} 
        />
        <Header key='numbers' title='Numbers' />
        <PhoneEntries key='phonelist' list={personsFiltered} deleteHandler={deleteEntry}/>
    </div>
)

export default PhoneList