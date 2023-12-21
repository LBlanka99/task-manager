import { IonAvatar, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonCol, IonGrid, IonLabel, IonNavLink, IonRouterLink, IonRow } from "@ionic/react";
import { Task, User } from "../theme/interfaces";
import "./TaskCard.css";
import TaskDetails from "./TaskDetails";
import { getContrastColor } from "../theme/colorUtils";

interface TaskProps {
    taskModel: Task,
    className: string
}

const TaskCard: React.FC<TaskProps> = ({taskModel, className}) => {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    const isDeadlineExpired = new Date(taskModel.deadline) < today;
    const isTaskCompleted = taskModel.status == 2;

    const detailsUrl = `/tasks/${taskModel.id}`;

    
    return (
        
        <IonCard  className={className} button >
            <IonRouterLink routerDirection="forward" routerLink={detailsUrl}>
            <IonCardHeader>
                <IonCardTitle className="ion-text-center" >{taskModel.title}</IonCardTitle>
            </IonCardHeader>

            <IonCardContent style={{padding: "0px"}}>
                <IonGrid>
                <IonRow className="ion-align-items-start ion-justify-content-end">
                    <IonCol className="ion-text-left">
                    {taskModel.tags.map((tag, index) => (
                        <IonChip key={index} style={{ backgroundColor: tag.color, color: getContrastColor(tag.color) }}>
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
                            <IonChip style={{ backgroundColor: assignee.profilColor, color: getContrastColor(assignee.profilColor) }}>{assignee.userName[0].toUpperCase()}</IonChip>
                            )}
                        </IonAvatar>
                        ))}
                    </div>
                    </IonCol>
                </IonRow>
                </IonGrid>
            </IonCardContent>
            </IonRouterLink>
        </IonCard>
        
    );
};

export default TaskCard;
