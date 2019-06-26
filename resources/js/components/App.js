import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            tasks: []
        };
        // bind
        this.handleChange = this.handleChange.bind(this);
        // bind handleSubmit method
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderTasks = this.renderTasks.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }
    

    handleChange(e) {
        this.setState({
            name: e.target.value
        });
    }

    handleSubmit(e) {
        // stop browser's default behaviour of reloading on form submit
        e.preventDefault();
        axios
            .post('/tasks', {
                name: this.state.name
            })
            .then(response => {
                console.log('from handle submit', response);
                //set state
                this.setState({
                    tasks: [response.data, ...this.state.tasks]
                });
                // then clear the value of textarea
                this.setState({
                    name: ''
                });
            });
    }
    // render tasks
    renderTasks() {
        return this.state.tasks.map(task => (
            <div key={task.id} className="media">
                <div className="media-body">
                    <div>
                        {task.name}{' '}
                        <span className="text-muted">
                            {' '}
                            <br />by {task.user.name} |{' '}
                            {task.updated_at
                                .split(' ')
                                .slice(1)
                                .join(' ')}
                        </span>
                        <div className="btn-group float-right">
                            <Link className="btn btn-sm btn-success" to={`/${task.id}/edit`}>
                                Edit
                            </Link>
                            <button onClick={() => this.handleDelete(task.id)} className="btn btn-sm btn-warning">
                                Delete
                            </button>
                        </div>
                    </div>
                    <hr />
                </div>
            </div>
        ));
    }
    // handle delete
    handleDelete(id) {
        // remove from local state
        const isNotId = task => task.id !== id;
        const updatedTasks = this.state.tasks.filter(isNotId);
        this.setState({ tasks: updatedTasks });
        // make delete request to the backend
        axios.delete(`/tasks/${id}`);
    }

    // handle update
    handleUpdate(id) {
        axios.put(`/tasks/${id}`).then(response => {
            this.getTasks();
        });
    }

    // get all tasks from backend
    getTasks() {
        axios.get('/tasks').then((
            response
        ) => this.setState({
            tasks: [...response.data.tasks]
        })
        );
    }  

    componentDidMount (){
        this.getTasks();
    }

    render() {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">Create Task</div>
                            <div className="card-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <textarea
                                            className="form-control"
                                            rows="5"
                                            value={this.state.name}
                                            placeholder="Create a new task"
                                            required
                                            maxLength="255"
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        Create Task
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <hr />
                    {this.renderTasks()}
                </div>
            </div>
        );
    }
}
