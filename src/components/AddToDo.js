import './Home.css';
import PropTypes from 'prop-types';

const { Component } = require("react");



export default class AddToDo extends Component{
    state = {
       
        id: "",
        title: "",
        completed: false,
    editMode:false,
    trail:""

        
    };
    
    handleIdChange = (event) => {
        this.setState({id:  event.target.value});
        };
  

    handleTitleChange = (event) => {
        this.setState({title:  event.target.value});
    };

    handleStatusChange = (event) => {
        const dd = event.target.value;
        this.setState({completed:event.target.value});
    };

    handleToDoSubmit = (event) => {
        const dd = this.state.details;
        event.preventDefault();
        this.props.newDetails({"id":this.state.id,"title":this.state.title,"completed":this.state.completed});
    };

    render(props){
      
        const editMode = this.state.editMode;
        const pageTitle = editMode ? 'Edit TODO' : 'Create TODO';
        const buttonTitle = editMode ? 'Update' : 'Post';
        return(
                <div>
                <h2>{pageTitle}</h2>
                <input placeholder="Enter Id" value={this.state.id} onChange={this.handleIdChange}/>
                <input placeholder="Enter Title" value={this.state.title}  onChange={this.handleTitleChange}/>
                <input type="checkbox" checked={this.state.completed} onChange={this.handleStatusChange} />
                <input type = "submit" value ={buttonTitle}  onClick={this.handleToDoSubmit} />
            </div>
           
            
        )
    }
}

