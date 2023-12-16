import { IonAlert, IonAvatar, IonBackButton, IonButton, IonButtons, IonChip, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonRoute, IonRow, IonText, IonTextarea, IonTitle, IonToolbar } from "@ionic/react";
import "./TaskDetails.css";
import { Tag, Task, User } from "../theme/interfaces";
import { useEffect, useState } from "react";
import { calendar, person, pricetag, informationCircle, calendarOutline, calendarSharp, personOutline, personSharp, trophyOutline, trophySharp, pricetagOutline, pricetagSharp, hourglassOutline, hourglassSharp, informationCircleOutline, trashOutline, trashSharp, pencilOutline, pencilSharp, checkmarkCircleOutline, checkmarkCircleSharp, checkmarkOutline, checkmarkSharp, happyOutline, happySharp, arrowUndoOutline, arrowUndoSharp, saveOutline, saveSharp, closeCircleOutline, closeSharp, closeCircleSharp, addOutline, addSharp } from "ionicons/icons";

interface TaskDetailsProps {
    task: Task
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task }) => {
    const [taskStatusText, setTaskStatusText] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newPoint, setNewPoint] = useState(task.points);
    const [newDescription, setNewDescription] = useState(task.description);
    const [newDeadline, setNewDeadline] = useState<Date | string>(task.deadline);

    useEffect(() => {
        switch (task.status) {
            case 0:
                return setTaskStatusText("folyamatban");
            case 1:
                return setTaskStatusText("jóváhagyásra vár");
            case 2:
                return setTaskStatusText("befejezett");
        };
    }, []);

    const handleDeleteTask = async () => {
        const apiAddress = `http://localhost:5180/api/v1/tasks/${task.id}`;

        const init: RequestInit = {
            method: "DELETE",
            credentials: "include",
            headers: new Headers([["content-type", "application/json"]]),
        }
        const response = await fetch(apiAddress, init);

        location.reload();
    }

    const handleEditTask = async () => {



        setIsEditing(false);
    }

    const handleRemoveAssignee = (assigneeId: string) => {
        // Handle assignee removal logic here
    };

    const handleRemoveTag = (tagId: string) => {
        // Handle tag removal logic here
    };

    const handleAddAssignee = () => {
        // Handle adding new assignee logic here
    };

    const handleAddTag = () => {
        // Handle adding new tag logic here
    };

    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton></IonBackButton>
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
                            {task.assignees.map((assignee: User, index) => (
                                <IonItem key={index} lines="none" className="item-inner-full" style={{ marginRight: isEditing ? "" : "8px" }}>
                                    {assignee.profilPicture !== undefined ? (
                                        <IonAvatar key={index} >
                                            <img alt="profile picture" src={assignee.profilPicture!} />
                                        </IonAvatar>
                                    ) : (
                                        <IonChip className="no-button" style={{ width: "33px", height: "33px" }}>{assignee.userName[0].toUpperCase()}</IonChip>
                                    )}
                                    <IonLabel slot={isEditing ? "" : "end"} style={{ marginRight: "0px", marginLeft: "10px" }}>{assignee.userName}</IonLabel>
                                    {isEditing &&
                                        <IonButton fill="clear" style={{ marginRight: "0px", paddingRight: "0px" }}>
                                            <IonIcon color="medium" ios={closeCircleSharp} md={closeSharp} onClick={() => handleRemoveAssignee(assignee.id)} />
                                        </IonButton>
                                    }
                                </IonItem>
                            ))}
                            {isEditing &&
                                <IonItem lines="none" className="ion-text-end">
                                    <IonLabel>
                                        <IonButton>
                                            <IonIcon ios={addOutline} md={addSharp} slot="start"/>
                                            <IonLabel>felelős</IonLabel>
                                        </IonButton>
                                    </IonLabel>
                                </IonItem>
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
                            {task.tags.map((tag: Tag) => (
                                <IonItem className="item-inner-full" key={tag.id} lines="none" style={{ marginRight: isEditing ? "" : "8px" }}>
                                    <IonChip className="no-button" slot={isEditing ? "" : "end"} style={{ backgroundColor: tag.color, marginRight: "0px" }}>{tag.name}</IonChip>
                                    {isEditing &&
                                        <IonButton slot="end" fill="clear" style={{ marginRight: "0px", paddingRight: "0px" }}>
                                            <IonIcon color="medium" ios={closeCircleSharp} md={closeSharp} onClick={() => handleRemoveTag(tag.id)} />
                                        </IonButton>
                                    }
                                </IonItem>
                            ))}
                            {isEditing &&
                                <IonItem lines="none" className="ion-text-end">
                                    <IonLabel>
                                        <IonButton>
                                            <IonIcon ios={addOutline} md={addSharp} slot="start"/>
                                            <IonLabel>címke</IonLabel>
                                        </IonButton>
                                    </IonLabel>
                                </IonItem>
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
                            className={isEditing ? "description" : ""}
                            readonly={!isEditing}
                            value={task.description ? task.description : "Nincs leírás"}
                            autoGrow
                            onIonChange={c => setNewDescription(c.detail.value!)}
                        />
                    </div>


                    <IonGrid style={{paddingTop: isEditing ? "20px" : "10px"}}>
                        <IonRow>
                            <IonCol>
                                {isEditing ?
                                    <IonChip color="primary" style={{ height: "39px" }} onClick={() => setIsEditing(false)}>
                                        <IonLabel class="edit-button">Mégsem</IonLabel>
                                        <IonIcon style={{ width: "22px", height: "22px" }} ios={arrowUndoOutline} md={arrowUndoSharp} />
                                    </IonChip>
                                    :
                                    <IonChip color="danger" style={{ height: "39px" }} onClick={() => setShowAlert(true)}>
                                        <IonLabel class="edit-button">Törlés</IonLabel>
                                        <IonIcon style={{ width: "22px", height: "22px" }} ios={trashOutline} md={trashSharp} />
                                    </IonChip>
                                }
                            </IonCol>
                            <IonCol class="ion-text-end">
                                {isEditing ?
                                    <IonChip color="secondary" style={{ height: "39px" }} onClick={handleEditTask}>
                                        <IonLabel class="edit-button">Mentés</IonLabel>
                                        <IonIcon style={{ width: "22px", height: "22px" }} ios={saveOutline} md={saveSharp} />
                                    </IonChip>
                                    :
                                    <IonChip color="primary" style={{ height: "39px" }} onClick={() => setIsEditing(true)}>
                                        <IonLabel class="edit-button">Szerkesztés</IonLabel>
                                        <IonIcon style={{ width: "22px", height: "22px" }} ios={pencilOutline} md={pencilSharp} />
                                    </IonChip>
                                }

                            </IonCol>
                        </IonRow>
                        {!isEditing &&
                            <IonRow class="ion-text-center ion-margin-top">
                                <IonCol>
                                    <IonChip color="success" >
                                        <IonLabel class="done-button">Kész!</IonLabel>
                                        <IonIcon style={{ width: "25px", height: "25px" }} ios={happyOutline} md={happySharp} />
                                    </IonChip>
                                </IonCol>
                            </IonRow>
                        }
                    </IonGrid>
                </IonList>

                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
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

            </IonContent>
        </>
    );
};

export default TaskDetails;
