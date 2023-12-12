import { IonAvatar, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonCol, IonGrid, IonLabel, IonRow } from "@ionic/react";
import { Task } from "../theme/interfaces";
import "./TaskCard.css";

interface TaskProps {
    taskModel: Task
}

const TaskCard: React.FC<TaskProps> = ({taskModel}) => {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    const isDeadlineExpired = new Date(taskModel.deadline) < today;
    const isTaskCompleted = taskModel.status == 2;

    return (
        <IonCard className="card">
            <IonCardHeader>
                <IonCardTitle className="ion-text-center">{taskModel.title}</IonCardTitle>
            </IonCardHeader>

            <IonCardContent style={{padding: "0px"}}>
                <IonGrid>
                <IonRow className="ion-align-items-start ion-justify-content-end">
                    <IonCol className="ion-text-right">
                    {taskModel.tags.map((tag, index) => (
                        <IonChip key={index} style={{ backgroundColor: tag.color }}>
                        {tag.name}
                        </IonChip>
                    ))}
                    </IonCol>
                </IonRow>

                <IonRow class="ion-align-items-center" style={{ marginBottom: "0px", height: "max-content" }}>
                    <IonCol>
                    <IonLabel className={isDeadlineExpired && !isTaskCompleted ? "expired" : ""}>
                        {taskModel.deadline.toString()}
                    </IonLabel>
                    </IonCol>
                    <IonCol className="ion-text-end">
                    <div className="assignee-row ion-text-end">
                        {taskModel.assignees.map((assignee, index) => (
                        <IonAvatar key={index}>
                            {assignee.profilPicture !== undefined ? (
                            <img alt="profile picture" src={assignee.profilPicture!} />
                            ) : (
                            <IonChip>{assignee.userName[0].toUpperCase()}</IonChip>
                            )}
                        </IonAvatar>
                        ))}
                    </div>
                    </IonCol>
                </IonRow>
                </IonGrid>
            </IonCardContent>
        </IonCard>
    );
};

export default TaskCard;
