export const columns = [
    // {name: 'ID', uid: 'transaction_id'},
    {name: 'REFERENCE', uid: 'reference'},
    {name: 'SERVICE', uid: 'transactionDetails.senderDetails.service'},
    {name: 'OPERATEUR', uid: 'transactionDetails.senderDetails.provider'},
    {name: 'NUMERO DESTINATAIRE', uid: 'transactionDetails.receiveDetails.phone_number'},
    {name: 'MONTANT', uid: 'amount'},
    {name: 'DATE ET HEURE', uid: 'createdAt'},
    {name: 'STATUS', uid: 'status'},
    {name: 'ACTIONS', uid: 'actions'},
];
