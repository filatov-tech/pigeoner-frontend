const Flight = ({flight}) => {
    return (
        `- ${flight.launchPoint.distance} ${flight.launchPoint.name}: ${flight.position}/${flight.totalParticipants}`
    );
};

export default Flight;