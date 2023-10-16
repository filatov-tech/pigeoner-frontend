const Flight = ({flight}) => {
    return (
        `- ${flight.distance} ${flight.location}: ${flight.position}/${flight.totalParticipants}`
    );
};

export default Flight;