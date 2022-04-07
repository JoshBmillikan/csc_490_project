import React, {FormEvent, useState} from 'react'
import './Settings.css'

export const Settings = (props:any) =>{
    // State
    const [fov, setFov] = useState<number>(props.fovNum)

    // Handles fov change on click
    const onSubmitHandler= (e:any) =>{
        let newFov = parseFloat((document.getElementById('fov') as HTMLInputElement).value)
        setFov(newFov)
        props.fov(newFov);
    }

    return(
            <div>
                <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content"  >
                            <div className="modal-header" >
                                <h5 className="modal-title" id="exampleModalLabel">FOV Settings</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">Fov</label>
                                    <input type="Number" className="form-control" id="fov"
                                           defaultValue={fov}/>
                                </div>
                            </div>
                            <div className={"modal-footer"}>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={onSubmitHandler} data-bs-dismiss='modal' >Ok</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)
}