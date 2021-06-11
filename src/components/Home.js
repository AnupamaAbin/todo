import './Home.css';
import './AddToDo';
import AddToDo from './AddToDo';
import ReactPaginate from 'react-paginate';
const { Component } = require("react");

export default class Home extends Component {

    constructor(props) {
        super(props);
        this.editToDo = this.editToDo.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        
        this.state = {
            todos: [],
            filteredTodos: [],
            offset: 0,
            data: [],
            perPage: 10,
            currentPage: 0,
            seletedType:"all",
            pageCount:0,
            editMode:false,
            edittodos: { id: '', title: '',completed:false }
            
    }
}

    // fetch data from url
    componentDidMount() {
        const apiUrl = 'https://jsonplaceholder.typicode.com/todos';
        fetch(apiUrl)
             .then(res => res.json())
            .then(
            (result) => {
                this.setState({
                isLoaded: true,
                todos: result,
                pageCount:result.length/this.state.perPage
                },()=>{this.updateList()});
            },
            (error) => {
                this.setState({
                isLoaded: true,
                error
                });
          }
        )
      }
    
    // function: delete record from the list
    deleteToDo = (todo) => {
        const filteredItems = this.state.todos.filter(x => x.id !== todo.id);
        this.setState({
            todos: filteredItems
        },()=>{this.updateList()});
    };

    // function : edit todos 
    editToDo = (e,todo) => {
        e.preventDefault();
        this.setState(state => ({ editMode: !state.editMode }));
        this.child.setState({
            id:todo.id,title:todo.title,completed:todo.completed,
            editMode:true
        })
       this.updateList();
    };
    
    // function : pagination
    handlePageClick =(eventData)=>{
        this.setState({offset:eventData.selected},()=>{
           this.updateList();
        });
       }
    // Add and update todos 
    manageTask = (childData) => {
        if(this.state.editMode){
            this.setState({todos: this.state.todos.map((task) => {
                if (task.id === childData.id) {
                    return { ...task, title: childData.title,completed:childData.completed };
                } else {
                    return task;
                }
                }),
            },()=>{this.updateList()});
        }
        else{
            this.setState({todos: [...this.state.todos,childData]
            },()=>{this.updateList()});
        }
        
    }

    // function : Categorize items  
    filterList = (type) => {

        if ("all"===type){
            this.setState({seletedType:"all"},()=>{this.updateList()});
            return;
        }
       let tempSeletedType=true;
        if("active"!==type){
            tempSeletedType=true;
        } else{
            tempSeletedType=false;
        }
        this.setState({seletedType:tempSeletedType,
                        pageCount:this.state.todos.length/this.state.perPage},()=>{this.updateList()});
        
      };

    //sub function : Categorize items
    updateList=()=>{
        if(this.state.seletedType==="all"){
        this.setState({filteredTodos:this.state.todos.slice((this.state.offset*this.state.perPage), (this.state.offset*this.state.perPage)+ this.state.perPage)},()=>{
            this.setState({pageCount:this.state.todos.length/this.state.perPage});
        }) ;
        }else{
            let temp=this.state.todos.filter(x => x.completed===this.state.seletedType);
        this.setState({
                filteredTodos:temp.slice((this.state.offset*this.state.perPage),
                    (this.state.offset*this.state.perPage)+ this.state.perPage)},()=>{
            this.setState({pageCount:temp.length/this.state.perPage});
        });
       
      }
    }
    // function : mark todo as completed
    handleRowClick = (e,completed) => {
        e.preventDefault();
        this.setState(state => ({
            todos: state.todos.map(todo => {
              if (todo.id === completed.id) {
                    return {
                        ...todo,
                        completed:true
                  };
             } else {
                 return todo;
             }
         })
     }));

     this.updateList();
    };
    
    render(){
         
        return(
            <form>
            <div>
            <AddToDo ref={ref =>(this.child =ref)} newDetails = {this.manageTask.bind(this)} ></AddToDo>
               
                <h1>
                    To Do List
                </h1>
                <div>
                <table>
                    <thead>
                        <tr >
                            <th>Id</th>
                            <th>Title</th>
                            <th>
                            <select onChange={(e) => this.filterList(e.target.value)}>
                                <option value="all">All</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                            </select>
                            </th>
                            <th>Action</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                       {this.state.filteredTodos.map(x => {
                         return (
                              <tr key={x.id}  onClick={ e => this.handleRowClick(e, x) }>
                              <td>{x.id}</td>
                              <td>{x.title}</td>
                              <td >{x.completed ? 'Done': 'Active'}</td>
                              <td>
                                 <button onClick={() => this.deleteToDo(x)}>Delete</button>
                                 <button onClick={ e => this.editToDo(e, x) }>Edit</button>
                                 
                                 
                              </td>
                              </tr>
                              
                          );
                       })}
                    </tbody>
                </table>
                <div><ReactPaginate
                                  previousLabel={"prev"}
                                  nextLabel={"next"}
                                  breakLabel={"..."}
                                  breakClassName={"break-me"}
                                  pageCount={this.state.pageCount}
                                  marginPagesDisplayed={2}
                                  pageRangeDisplayed={5}
                                  onPageChange={this.handlePageClick}
                                  containerClassName={"pagination"}
                                  subContainerClassName={"pages pagination"}
                                  activeClassName={"active"}/></div>
            </div></div>
        </form>
        );
    }
}