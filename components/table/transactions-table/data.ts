export const columns = [
    // {name: 'ID', uid: 'transaction_id'},
    {name: 'REFERENCE', uid: 'reference'},
    {name: 'NUMERO', uid: 'paymentDetails.phone_number'},
    {name: 'MONTANT', uid: 'amount'},
    {name: 'MODE DE PAIEMENT', uid: 'paymentDetails.service'},
    {name: 'OPERATEUR', uid: 'paymentDetails.provider'},
    {name: 'DATE ET HEURE', uid: 'createdAt'},
    {name: 'STATUS', uid: 'status'},
    {name: 'DESCRIPTION', uid: 'category'},
    {name: "FRAIS", uid: 'transactionFees.amount'},
    {name: 'ACTIONS', uid: 'actions'},
];
