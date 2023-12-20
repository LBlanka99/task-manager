import { IonAlert, IonAvatar, IonBackButton, IonButton, IonButtons, IonChip, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonModal, IonPage, IonRoute, IonRow, IonText, IonTextarea, IonTitle, IonToolbar } from "@ionic/react";
import "./TaskDetails.css";
import { Group, Tag, Task, User } from "../theme/interfaces";
import { useEffect, useRef, useState } from "react";
import { calendar, person, pricetag, informationCircle, calendarOutline, calendarSharp, personOutline, personSharp, trophyOutline, trophySharp, pricetagOutline, pricetagSharp, hourglassOutline, hourglassSharp, informationCircleOutline, trashOutline, trashSharp, pencilOutline, pencilSharp, checkmarkCircleOutline, checkmarkCircleSharp, checkmarkOutline, checkmarkSharp, happyOutline, happySharp, arrowUndoOutline, arrowUndoSharp, saveOutline, saveSharp, closeCircleOutline, closeSharp, closeCircleSharp, addOutline, addSharp, skullOutline, skullSharp, cloudDoneOutline } from "ionicons/icons";
import { useParams } from "react-router";

interface TaskDetailsProps {
    currentUser: User | undefined;
}

interface RouteParams {
    taskId: string;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ currentUser }) => {
    let { taskId } = useParams<RouteParams>();
    const [task, setTask] = useState<Task | undefined>();
    const [taskStatusText, setTaskStatusText] = useState("");
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [showDoneAlert, setShowDoneAlert] = useState(false);
    const [showEditAlert, setShowEditAlert] = useState(false);
    const [editAlertMessage, setEditAlertMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(task?.title);
    const [newPoint, setNewPoint] = useState(task?.points);
    const [newDescription, setNewDescription] = useState(task?.description);
    const [newDeadline, setNewDeadline] = useState<Date | string>("");
    const [newAssignees, setNewAssignees] = useState<User[]>([]);
    const [newTags, setNewTags] = useState<Tag[]>([]);
    const [furtherAssignees, setFurtherAssignees] = useState<User[]>([]);
    const [furtherTags, setFurtherTags] = useState<Tag[]>([]);

    const assigneeModal = useRef<HTMLIonModalElement>(null);
    const tagModal = useRef<HTMLIonModalElement>(null);

    useEffect(() => {
        const apiAddress = `http://localhost:5180/api/v1/tasks/${taskId}`;

        fetch(apiAddress, { credentials: "include" }).then((res) => res.json()).then((res: Task) => {
            setTask(res);

            setNewTitle(res.title);
            setNewPoint(res.points);
            setNewDescription(res.description);
            setNewDeadline(res.deadline);
            setNewAssignees([...res.assignees]);
            setNewTags([...res.tags]);
        });
    }, []);

    useEffect(() => {
        if (task) {
            switch (task.status) {
                case 0:
                    return setTaskStatusText("folyamatban");
                case 1:
                    return setTaskStatusText("jóváhagyásra vár");
                case 2:
                    return setTaskStatusText("befejezett");
            };
        }
    }, [task]);

    useEffect(() => {
        if (task) {
            setNewTitle(task.title);
            setNewPoint(task.points);
            setNewDescription(task.description);
            setNewDeadline(task.deadline);
            setNewAssignees([...task.assignees]);
            setNewTags([...task.tags]);
        }
    }, [isEditing]);

    useEffect(() => {
        if (currentUser) {
            const apiAddress = `http://localhost:5180/api/v1/groups/${currentUser.id}`;

            fetch(apiAddress, { credentials: "include" }).then((res) => res.json()).then((res: Group) => {
                let allUsers = res.members;
                allUsers = allUsers.filter(u => !newAssignees.some(a => a.id == u.id));
                setFurtherAssignees(allUsers);
            });
        }

    }, [newAssignees]);

    useEffect(() => {
        if (currentUser) {
            const apiAddress = `http://localhost:5180/api/v1/groups/${currentUser.id}`;

            fetch(apiAddress, { credentials: "include" }).then((res) => res.json()).then((res: Group) => {
                let allTags = res.tags;
                allTags = allTags.filter(t => !newTags?.some(nt => nt.id == t.id));
                setFurtherTags(allTags);
            });
        }

    }, [newTags]);

    const handleDeleteTask = async () => {
        const apiAddress = `http://localhost:5180/api/v1/tasks/${task?.id}`;

        const init: RequestInit = {
            method: "DELETE",
            credentials: "include",
            headers: new Headers([["content-type", "application/json"]]),
        }
        const response = await fetch(apiAddress, init);

        location.reload();
    }

    const handleEditTask = async () => {
        if (newAssignees.length < 1) {
            setEditAlertMessage("Legalább 1 felelősnek lennie kell a feladaton!");
            setShowEditAlert(true);
            return;
        }
        if (newPoint! < 1 || newPoint! > 100 || newPoint! % 1 != 0) {
            setEditAlertMessage("A kapható pontnak egy 1 és 100 közötti egész számnak kell lennie!");
            setShowEditAlert(true);
            return;
        }

        const updatedTask = {
            "title": newTitle,
            "deadline": newDeadline,
            "assignees": newAssignees,
            "points": newPoint,
            "tags": newTags,
            "description": newDescription
        }

        const apiAddress = `http://localhost:5180/api/v1/tasks/${task?.id}`;

        const init: RequestInit = {
            method: "PUT",
            credentials: "include",
            headers: new Headers([["content-type", "application/json"]]),
            body: JSON.stringify(updatedTask),
        }
        const response = await fetch(apiAddress, init);
        const responseTask: Task = await response.json();
        setTask(responseTask);

        setIsEditing(false);
    }

    const handleRemoveAssignee = (user: User) => {
        const updatedAssignees = newAssignees.filter(u => u.id !== user.id);
        setNewAssignees([...updatedAssignees]);
    };

    const handleRemoveTag = (tag: Tag) => {
        const updatedTags = newTags.filter(t => t.id !== tag.id);
        setNewTags(updatedTags);
    };

    const handleAddAssignee = (user: User) => {
        newAssignees.push(user);
        setNewAssignees([...newAssignees]);
    };

    const handleAddTag = (tag: Tag) => {
        newTags.push(tag);
        setNewTags([...newTags]);
    };

    const changeTaskStatus = async (statusNumber: Number) => {
        const apiAddress = `http://localhost:5180/api/v1/tasks/${task?.id}/status-change`;

        const init: RequestInit = {
            method: "PATCH",
            credentials: "include",
            headers: new Headers([["content-type", "application/json"]]),
            body: JSON.stringify(statusNumber),
        }
        const response = await fetch(apiAddress, init);
        const responseTask: Task = await response.json();
        setTask(responseTask);

        if (statusNumber == 2) {
            await scorePoints();
        }

        if (statusNumber != 0) {
            setShowDoneAlert(true);
        }

    }

    const scorePoints = async () => {
        const today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        const isDeadlineExpired = new Date(task!.deadline) < today;

        let pointsToAdd = task!.points;

        if (isDeadlineExpired) {
            const deadline = new Date(task!.deadline);
            deadline.setHours(0);
            const daysPassed: number = Math.floor((today.getTime() - deadline.getTime()) / (1000 * 3600 * 24));
            pointsToAdd = (pointsToAdd - daysPassed) < 1 ? 1 : pointsToAdd - daysPassed;
        }

        task?.assignees.forEach(user => {
            const apiAddress = `http://localhost:5180/api/v1/users/${user.id}/add-points`;
            const init: RequestInit = {
                method: "PATCH",
                credentials: "include",
                headers: new Headers([["content-type", "application/json"]]),
                body: JSON.stringify(pointsToAdd),
            }
            fetch(apiAddress, init);
        })
    }

    return (
        <>
            {task &&
                <IonPage>
                    <IonHeader>
                        <IonToolbar>
                            <IonButtons slot="start">
                                <IonBackButton defaultHref="/tasks"></IonBackButton>
                            </IonButtons>
                            <IonTitle>{task.title}</IonTitle>
                        </IonToolbar>
                    </IonHeader>

                    <IonContent class="ion-padding" color="light">
                        <IonList inset style={{ margin: "auto", maxWidth: "500px", paddingTop: "10px", paddingBottom: "5px" }}>
                            <IonItem>
                                <IonIcon ios={calendarOutline} md={calendarSharp} slot="start" color="primary" />
                                <IonLabel color="primary">Határidő</IonLabel>
                                {isEditing ?
                                    <IonDatetimeButton datetime="datepicker" />
                                    :
                                    <IonText style={{ marginRight: "8px" }}>{task.deadline.toString()}</IonText>
                                }

                                <IonModal keepContentsMounted>
                                    <IonDatetime
                                        id="datepicker"
                                        presentation="date"
                                        firstDayOfWeek={1}
                                        showDefaultButtons
                                        locale="hu-HU"
                                        doneText="Kész"
                                        cancelText="Mégsem"
                                        max="2030-12-31"
                                        min={new Date().toISOString()}
                                        value={newDeadline.toString()}
                                        onIonChange={e => setNewDeadline(e.detail.value!.slice(0, 10) as string)}
                                    />
                                </IonModal>

                            </IonItem>
                            <IonItem>
                                <IonIcon ios={personOutline} md={personSharp} slot="start" color="primary" />
                                <IonLabel color="primary">Felelősök</IonLabel>
                                <IonList>
                                    {isEditing ? (
                                        newAssignees.map((assignee: User, index) => (
                                            <IonItem key={index} lines="none" className="item-inner-full">
                                                {assignee.profilPicture !== undefined ? (
                                                    <IonAvatar key={index} >
                                                        <IonImg alt="profile picture" src={assignee.profilPicture!} />
                                                    </IonAvatar>
                                                ) : (
                                                    <IonChip className="no-button" style={{ width: "33px", height: "33px", backgroundColor: assignee.profilColor }}>{assignee.userName[0].toUpperCase()}</IonChip>
                                                )}
                                                <IonLabel style={{ marginRight: "0px", marginLeft: "10px" }}>{assignee.userName}</IonLabel>
                                                <IonButton fill="clear" style={{ marginRight: "0px", paddingRight: "0px" }} onClick={() => handleRemoveAssignee(assignee)} >
                                                    <IonIcon color="medium" ios={closeCircleSharp} md={closeSharp} />
                                                </IonButton>
                                            </IonItem>
                                        )))
                                        : (
                                            task.assignees.map((assignee: User, index) => (
                                                <IonItem key={index} lines="none" className="item-inner-full" style={{ marginRight: "8px" }}>
                                                    {assignee.profilPicture !== undefined ? (
                                                        <IonAvatar key={index} >
                                                            <IonImg alt="profile picture" src={assignee.profilPicture!} />
                                                        </IonAvatar>
                                                    ) : (
                                                        <IonChip className="no-button" style={{ width: "33px", height: "33px", backgroundColor: assignee.profilColor }}>{assignee.userName[0].toUpperCase()}</IonChip>
                                                    )}
                                                    <IonLabel slot={"end"} style={{ marginRight: "0px", marginLeft: "10px" }}>{assignee.userName}</IonLabel>
                                                </IonItem>
                                            ))
                                        )
                                    }
                                    {isEditing &&
                                        <>
                                            <IonItem lines="none" className="ion-text-end">
                                                <IonLabel>
                                                    <IonButton id="open-assignees-modal">
                                                        <IonIcon ios={addOutline} md={addSharp} slot="start" />
                                                        <IonLabel>felelős</IonLabel>
                                                    </IonButton>
                                                </IonLabel>
                                            </IonItem>

                                            <IonModal id="new-assignees-modal" className="add-new-modal" trigger="open-assignees-modal" ref={assigneeModal} backdropDismiss keyboardClose>
                                                <IonContent scrollY={false}>
                                                    <IonToolbar>
                                                        <IonTitle>Új felelős</IonTitle>
                                                        <IonButtons slot="start">
                                                            <IonButton color="primary" onClick={() => assigneeModal.current?.dismiss()}>
                                                                Vissza
                                                            </IonButton>
                                                        </IonButtons>
                                                    </IonToolbar>
                                                    <IonList inset>
                                                        {furtherAssignees.map((user, index) => (
                                                            <IonItem key={index} style={{ marginTop: "4px", marginBottom: "4px" }} button detail={false} onClick={() => handleAddAssignee(user)}>
                                                                {user.profilPicture !== undefined ? (
                                                                    <IonAvatar key={index} >
                                                                        <IonImg alt="profile picture" src={user.profilPicture!} />
                                                                    </IonAvatar>
                                                                ) : (
                                                                    <IonChip className="no-button" style={{ width: "33px", height: "33px", backgroundColor: user.profilColor }}>{user.userName[0].toUpperCase()}</IonChip>
                                                                )}
                                                                <IonLabel style={{ marginLeft: "10px" }}>
                                                                    <h2 >{user.userName}</h2>
                                                                    <p>{user.roles.includes("taskCreator") ? "frankó felnőtt" : "lezser lurkó"}</p>
                                                                </IonLabel>

                                                            </IonItem>
                                                        ))}
                                                    </IonList>
                                                </IonContent>
                                            </IonModal>
                                        </>
                                    }
                                </IonList>
                            </IonItem>
                            <IonItem>
                                <IonIcon ios={trophyOutline} md={trophySharp} slot="start" color="primary" />
                                <IonLabel color="primary">Kapható pont fejenként</IonLabel>
                                <IonInput
                                    class="ion-text-end ion-align-items-center"
                                    type="number"
                                    inputmode="numeric"
                                    min={1}
                                    max={100}
                                    value={newPoint}
                                    clearInput
                                    onIonInput={(i) => setNewPoint(Number(i.detail.value))}
                                    required
                                    readonly={!isEditing}
                                />
                            </IonItem>
                            <IonItem>
                                <IonIcon ios={pricetagOutline} md={pricetagSharp} slot="start" color="primary" />
                                <IonLabel color="primary">Címkék</IonLabel>
                                <IonList>
                                    {isEditing ? (
                                        newTags.map((tag: Tag) => (
                                            <IonItem className="item-inner-full" key={tag.id} lines="none">
                                                <IonChip className="no-button" style={{ backgroundColor: tag.color, marginRight: "0px" }}>{tag.name}</IonChip>
                                                <IonButton slot="end" fill="clear" style={{ marginRight: "0px", paddingRight: "0px" }} onClick={() => handleRemoveTag(tag)} >
                                                    <IonIcon color="medium" ios={closeCircleSharp} md={closeSharp} />
                                                </IonButton>
                                            </IonItem>
                                        ))
                                    ) : (
                                        task.tags.map((tag: Tag) => (
                                            <IonItem className="item-inner-full" key={tag.id} lines="none" style={{ marginRight: "8px" }}>
                                                <IonChip className="no-button" slot={"end"} style={{ backgroundColor: tag.color, marginRight: "0px" }}>{tag.name}</IonChip>
                                            </IonItem>
                                        )))
                                    }
                                    {isEditing &&
                                        <>
                                            <IonItem lines="none" className="ion-text-end">
                                                <IonLabel>
                                                    <IonButton id="open-new-tag-modal">
                                                        <IonIcon ios={addOutline} md={addSharp} slot="start" />
                                                        <IonLabel>címke</IonLabel>
                                                    </IonButton>
                                                </IonLabel>
                                            </IonItem>

                                            <IonModal className="modal" id="add-tag-modal" trigger="open-new-tag-modal" ref={tagModal} backdropDismiss keyboardClose>
                                                <IonContent scrollY={false}>
                                                    <IonToolbar>
                                                        <IonButtons slot="start">
                                                            <IonButton color="primary" onClick={() => tagModal.current?.dismiss()}>
                                                                Vissza
                                                            </IonButton>
                                                        </IonButtons>
                                                        <IonTitle>Új címke</IonTitle>
                                                    </IonToolbar>
                                                    <IonList inset>
                                                        {furtherTags.map((tag, index) => (
                                                            <IonChip key={index} style={{ backgroundColor: tag.color, margin: "10px" }} onClick={() => handleAddTag(tag)}>{tag.name}</IonChip>

                                                        ))}
                                                    </IonList>
                                                </IonContent>
                                            </IonModal>
                                        </>
                                    }
                                </IonList>
                            </IonItem>
                            <IonItem>
                                <IonIcon ios={hourglassOutline} md={hourglassSharp} slot="start" color="primary" />
                                <IonLabel color="primary">Státusz</IonLabel>
                                <IonText style={{ marginRight: "8px" }}>{taskStatusText}</IonText>
                            </IonItem>
                            <IonItem>
                                <IonIcon ios={informationCircleOutline} slot="start" color="primary" />
                                <IonLabel style={{ marginBottom: "" }} color="primary">Leírás</IonLabel>
                            </IonItem>
                            <div style={{ paddingLeft: "57.59px", marginRight: "24px" }}>
                                <IonTextarea
                                    className={isEditing ? "description" : "no-button"}
                                    readonly={!isEditing}
                                    value={task.description ? task.description : "Nincs leírás"}
                                    autoGrow
                                    onIonChange={c => setNewDescription(c.detail.value!)}
                                />
                            </div>

                            <IonGrid style={{ paddingTop: isEditing ? "20px" : "10px" }}>
                                {currentUser?.roles.includes("taskCreator") &&
                                    <IonRow>
                                        <IonCol>
                                            {isEditing ?
                                                <IonChip color="primary" style={{ height: "39px" }} onClick={() => setIsEditing(false)}>
                                                    <IonLabel class="edit-button">Mégsem</IonLabel>
                                                    <IonIcon style={{ width: "22px", height: "22px" }} ios={arrowUndoOutline} md={arrowUndoSharp} />
                                                </IonChip>
                                                : task.status == 0 ?
                                                    <IonChip color="danger" style={{ height: "39px" }} onClick={() => setShowDeleteAlert(true)}>
                                                        <IonLabel class="edit-button">Törlés</IonLabel>
                                                        <IonIcon style={{ width: "22px", height: "22px" }} ios={trashOutline} md={trashSharp} />
                                                    </IonChip>
                                                    : task.status == 1 &&
                                                    <IonChip color="warning" style={{ height: "39px" }} onClick={() => changeTaskStatus(0)}>
                                                        <IonLabel class="edit-button">Visszaküld</IonLabel>
                                                        <IonIcon style={{ width: "22px", height: "22px" }} ios={skullOutline} md={skullSharp} />
                                                    </IonChip>
                                            }
                                        </IonCol>
                                        <IonCol class="ion-text-end">
                                            {isEditing ?
                                                <IonChip color="secondary" style={{ height: "39px" }} onClick={handleEditTask}>
                                                    <IonLabel class="edit-button">Mentés</IonLabel>
                                                    <IonIcon style={{ width: "22px", height: "22px" }} ios={saveOutline} md={saveSharp} />
                                                </IonChip>
                                                : task.status == 0 ?
                                                    <IonChip color="primary" style={{ height: "39px" }} onClick={() => setIsEditing(true)}>
                                                        <IonLabel class="edit-button">Szerkesztés</IonLabel>
                                                        <IonIcon style={{ width: "22px", height: "22px" }} ios={pencilOutline} md={pencilSharp} />
                                                    </IonChip>
                                                    : task.status == 1 &&
                                                    <IonChip color="success" style={{ height: "39px" }} onClick={() => changeTaskStatus(2)}>
                                                        <IonLabel class="edit-button">Jóváhagy</IonLabel>
                                                        <IonIcon style={{ width: "22px", height: "22px" }} ios={checkmarkCircleOutline} md={checkmarkCircleSharp} />
                                                    </IonChip>
                                            }
                                        </IonCol>
                                    </IonRow>
                                }
                                {!isEditing && task.assignees.some(u => u.id == currentUser?.id) && task.status == 0 &&
                                    <IonRow class="ion-text-center ion-margin-top">
                                        <IonCol>
                                            <IonChip color="success" onClick={() => changeTaskStatus(currentUser?.roles.includes("taskCreator") ? 2 : 1)} >
                                                <IonLabel class="done-button">Kész!</IonLabel>
                                                <IonIcon style={{ width: "25px", height: "25px" }} ios={happyOutline} md={happySharp} />
                                            </IonChip>
                                        </IonCol>
                                    </IonRow>
                                }
                            </IonGrid>
                        </IonList>

                        <IonAlert
                            isOpen={showDeleteAlert}
                            onDidDismiss={() => setShowDeleteAlert(false)}
                            header={"Törlés megerősítése"}
                            message={"Biztos vagy benne, hogy törölni szeretnéd ezt a feladatot?"}
                            buttons={[
                                {
                                    text: "Mégsem",
                                    role: "cancel",
                                },
                                {
                                    text: "Törlés",
                                    role: "confirm",
                                    handler: handleDeleteTask
                                },
                            ]}
                        />

                        <IonAlert
                            isOpen={showDoneAlert}
                            onDidDismiss={() => setShowDoneAlert(false)}
                            backdropDismiss={false}
                            header={"Juhú!"}
                            message={currentUser?.roles.includes("taskCreator") ? "Sikeresen késznek nyilvánítottad a feladatot." : "Sikeresen beadtad ellenőrzésre a feladatot. Várj, amíg egyik kedves szülőd késznek nyilvánítja, hogy megkapd az érte járó pontokat."}
                            buttons={["OK"]}
                        />

                        <IonAlert
                            isOpen={showEditAlert}
                            onDidDismiss={() => setShowEditAlert(false)}
                            header={"Sikertelen mentés"}
                            message={editAlertMessage}
                            buttons={["OK"]}
                        />

                    </IonContent>
                </IonPage>
            }
        </>
    );
};

export default TaskDetails;
