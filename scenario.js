// French air traffic control strike, 22-26 April 2024, replayed against a
// synthetic land-only operator.
//
// Land-only: guests book their own flights. The operator knows a guest's flight
// only if they put it on the pre-trip form, which the DMC uses to book airport
// transfers. Hotels and transfers are prepaid. When a flight is cancelled the
// operator doesn't rebook anything: it finds out the guest's new arrival, moves
// the transfer with the DMC, tells the hotel, and works out where the guest
// joins the group.
//
// Two kinds of entry, never mixed:
//   public  - real, dated, linked, entering at publication time. From
//             a sourced research file, each entry linked below.
//   private - synthetic: the operator, guests, DMCs, trip leaders and every
//             message between them. Airlines "Solent Air" and "Brightwing" and
//             all flight numbers are invented.

export const scenario = {
  hazard: { date: '2024-04-25', endsAfter: '2024-04-26T00:00:00+01:00' },
  operator: {
    name: 'Fernway Travel',
    team: {
      hannah: { name: 'Hannah', role: 'Head of operations' },
      sam: { name: 'Sam', role: 'Operations' },
      nadia: { name: 'Nadia', role: 'Guest care' },
    },
    authority: {
      itinerary: 'hannah', guestMessage: 'hannah', transfer: 'sam',
    },
  },
  trips: [
    {
      id: 'RIV', trip: 'Riviera coast walk', starts: 'Thu 25 Apr, welcome drinks 18:00 in Menton',
      leader: { key: 'luc', name: 'Luc', role: 'Trip leader, Riviera' },
      dmc: { key: 'azur', name: 'Azur Ground', role: 'DMC, Nice' },
      guests: [
        { name: 'Priti S.', travel: { mode: 'already there', note: 'arrived Menton Wed' } },
        { name: 'Leo H.', travel: { mode: 'already there', note: 'arrived Menton Wed' } },
        { name: 'Aisha B.', travel: { mode: 'air', flight: 'SA 811', route: 'Gatwick → Nice', date: '2024-04-25', time: '09:40', france: 'lands' } },
        { name: 'Tom R.', travel: { mode: 'air', flight: 'SA 811', route: 'Gatwick → Nice', date: '2024-04-25', time: '09:40', france: 'lands' } },
        { name: 'Jen W.', travel: { mode: 'air', flight: 'SA 811', route: 'Gatwick → Nice', date: '2024-04-25', time: '09:40', france: 'lands' } },
        { name: 'Marcus O.', travel: { mode: 'air', flight: 'SA 811', route: 'Gatwick → Nice', date: '2024-04-25', time: '09:40', france: 'lands' } },
        { name: 'Kate D.', travel: { mode: 'air', flight: 'BW 220', route: 'Manchester → Nice', date: '2024-04-25', time: '11:05', france: 'lands' } },
        { name: 'Sian M.', travel: { mode: 'air', flight: 'BW 220', route: 'Manchester → Nice', date: '2024-04-25', time: '11:05', france: 'lands' } },
        { name: 'Ben A.', travel: { mode: 'air', flight: 'BW 220', route: 'Manchester → Nice', date: '2024-04-25', time: '11:05', france: 'lands' } },
        { name: 'Clare F.', travel: { mode: 'air', flight: 'BW 318', route: 'Bristol → Nice', date: '2024-04-25', time: '13:30', france: 'lands' } },
        { name: 'Raj P.', travel: { mode: 'air', flight: 'BW 318', route: 'Bristol → Nice', date: '2024-04-25', time: '13:30', france: 'lands' } },
        { name: 'Emma L.', travel: null },
      ],
    },
    {
      id: 'AND', trip: 'Andalusia white villages', starts: 'Thu 25 Apr, transfer from Málaga 16:00',
      leader: { key: 'pilar', name: 'Pilar', role: 'Trip leader, Andalusia' },
      dmc: { key: 'sur', name: 'Sur Travel', role: 'DMC, Málaga' },
      guests: [
        { name: 'Dev M.', travel: { mode: 'air', flight: 'SA 372', route: 'Manchester → Málaga', date: '2024-04-25', time: '07:15', france: 'overflies' } },
        { name: 'Ian G.', travel: { mode: 'air', flight: 'SA 372', route: 'Manchester → Málaga', date: '2024-04-25', time: '07:15', france: 'overflies' } },
        { name: 'Nora Y.', travel: { mode: 'air', flight: 'SA 372', route: 'Manchester → Málaga', date: '2024-04-25', time: '07:15', france: 'overflies' } },
        { name: 'Paul Z.', travel: { mode: 'air', flight: 'SA 372', route: 'Manchester → Málaga', date: '2024-04-25', time: '07:15', france: 'overflies' } },
        { name: 'Amy C.', travel: { mode: 'air', flight: 'SA 372', route: 'Manchester → Málaga', date: '2024-04-25', time: '07:15', france: 'overflies' } },
        { name: 'Ruth K.', travel: { mode: 'air', flight: 'BW 402', route: 'Heathrow → Málaga', date: '2024-04-25', time: '08:50', france: 'overflies' } },
        { name: 'Hugh S.', travel: { mode: 'already there', note: 'in Málaga since Tue' } },
        { name: 'Lina F.', travel: { mode: 'rail', note: 'train from Madrid Thu' } },
        { name: 'Zoe B.', travel: { mode: 'rail', note: 'train from Madrid Thu' } },
        { name: 'Carl W.', travel: { mode: 'already there', note: 'in Málaga since Mon' } },
        { name: 'Esme D.', travel: { mode: 'already there', note: 'in Málaga since Mon' } },
      ],
    },
    {
      id: 'HEB', trip: 'Hebrides island hopper', starts: 'running since Wed 24 Apr, Oban',
      leader: { key: 'morag', name: 'Morag', role: 'Trip leader, Hebrides' },
      dmc: null,
      guests: ['Ali H.', 'Bea N.', 'Cal R.', 'Dina O.', 'Ed T.', 'Fay U.', 'Gus L.', 'Hana K.'].map((name) => ({ name, travel: { mode: 'already there', note: 'on the trip' } })),
    },
  ],

  events: [
    {
      id: 'e1', t: '2024-04-22T13:00:00+01:00', kind: 'public',
      source: { label: 'Air Journal', url: 'https://www.air-journal.fr/2024-04-22-greve-des-controleurs-aeriens-jusqua-70-de-vols-annules-jeudi-5255337.html', stamp: '22 Apr 14:00 CEST' },
      text: 'French air traffic controllers file a strike notice for Thursday 25 April. Up to 70% of flights at major airports could be cancelled.',
      effects: [{ type: 'strike', status: 'notice filed' }],
    },
    {
      id: 'e2', t: '2024-04-23T09:30:00+01:00', kind: 'private', from: 'Emma L. (WhatsApp)', channel: 'whatsapp',
      text: 'Sorry, forgot the form! I\'m on the train from Paris on Thursday, into Menton at 15:10.',
      effects: [{ type: 'travel-details', guest: 'Emma L.', travel: { mode: 'rail', note: 'train from Paris, Menton 15:10 Thu' } }],
    },
    {
      id: 'e3', t: '2024-04-23T10:05:00+01:00', kind: 'private', from: 'Nadia (guest messages)', channel: 'whatsapp',
      text: 'Aisha, Tom, Jen and Marcus have each been in touch: Solent Air cancelled SA 811 on Thursday. All four have rebooked themselves on SA 815, Friday, landing Nice 12:10.',
      effects: [{ type: 'flight', status: 'cancelled', flight: 'SA 811', guests: ['Aisha B.', 'Tom R.', 'Jen W.', 'Marcus O.'], newArrival: 'SA 815, Fri 12:10 Nice', from: 'each guest' }],
    },
    {
      id: 'e4', t: '2024-04-23T11:00:00+01:00', kind: 'decision', by: 'sam',
      text: 'Sent the transfer change to Azur Ground for the four on SA 815.',
      effects: [{ type: 'decide', id: 'transfer-RIV-1', by: 'sam' }],
    },
    {
      id: 'e5', t: '2024-04-23T14:20:00+01:00', kind: 'private', from: 'Azur Ground (WhatsApp)', channel: 'whatsapp',
      text: 'Pickup booked Fri 12:30 Nice for Aisha B, Tom R, Jen W, Marcus O. Hotel Bellevue told they arrive Friday, rooms held.',
      effects: [{ type: 'dmc-confirm', dmc: 'azur', guests: ['Aisha B.', 'Tom R.', 'Jen W.', 'Marcus O.'], what: 'Fri 12:30 pickup; hotel holding rooms' }],
    },
    {
      id: 'e6', t: '2024-04-23T17:30:00+01:00', kind: 'decision', by: 'hannah',
      text: 'Approved Luc\'s plan: Friday\'s walk starts at 14:00 instead of 10:00 so the four can join. Send the four their message.',
      effects: [{ type: 'decide', id: 'joinup-RIV', by: 'hannah' }, { type: 'approve-drafts', trip: 'RIV' }],
    },
    {
      id: 'e7', t: '2024-04-24T12:00:00+01:00', kind: 'public',
      source: { label: 'Air Journal', url: 'https://www.air-journal.fr/2024-04-24-la-greve-des-controleurs-aeriens-ce-jeudi-annulee-a-la-derniere-minute-5255375.html', stamp: '24 Apr 13:00 CEST' },
      text: 'The controllers\' union lifts Thursday\'s strike notice: "Un accord a été trouvé". The same article reports airlines had already been told to cut Thursday flights: 75% at Orly, 65% at Charles de Gaulle, 60% at Nice, 50% at other French airports.',
      effects: [
        { type: 'strike', status: 'notice withdrawn' },
        { type: 'official', status: 'Thursday flight cuts not reported reversed' },
        { type: 'claim', subject: 'the cut at Charles de Gaulle', value: '65%', relevant: false },
      ],
    },
    {
      id: 'e8', t: '2024-04-24T12:40:00+01:00', kind: 'private', from: 'Dev M. (WhatsApp)', channel: 'whatsapp',
      text: 'Just seen the French strike\'s been called off. So we\'re all good for tomorrow morning?',
      effects: [{ type: 'guest-question', guest: 'Dev M.' }],
    },
    {
      id: 'e9', t: '2024-04-24T13:15:00+01:00', kind: 'public',
      source: { label: 'Lyon Capitale', url: 'https://www.lyoncapitale.fr/actualite/45-des-vols-annules-a-l-aeroport-de-lyon-jeudi-malgre-la-levee-d-un-preavis-de-greve-des-controleurs', stamp: '24 Apr 14:15 CEST' },
      text: '45% of Thursday\'s flights at Lyon are cancelled despite the strike notice being lifted.',
      effects: [{ type: 'news-scope', airport: 'Lyon' }],
    },
    {
      id: 'e10', t: '2024-04-24T18:55:00+01:00', kind: 'private', from: 'Nadia (guest messages)', channel: 'whatsapp',
      text: 'Dev, Ian, Nora, Paul and Amy: Solent Air has cancelled SA 372 tomorrow, French airspace. All five have rebooked themselves on SA 376, Friday, landing Málaga 11:00. Nothing from Ruth.',
      effects: [{ type: 'flight', status: 'cancelled', flight: 'SA 372', guests: ['Dev M.', 'Ian G.', 'Nora Y.', 'Paul Z.', 'Amy C.'], newArrival: 'SA 376, Fri 11:00 Málaga', from: 'each guest' }],
    },
    {
      id: 'e11', t: '2024-04-24T19:10:00+01:00', kind: 'private', from: 'Clare F. (WhatsApp)', channel: 'whatsapp',
      text: 'Our Brightwing flight tomorrow is cancelled. Raj and I are on BW 322 Friday instead, landing Nice 11:20.',
      effects: [{ type: 'flight', status: 'cancelled', flight: 'BW 318', guests: ['Clare F.', 'Raj P.'], newArrival: 'BW 322, Fri 11:20 Nice', from: 'Clare, for both' }],
    },
    {
      id: 'e12', t: '2024-04-24T19:30:00+01:00', kind: 'decision', by: 'hannah',
      text: 'Approved: the Andalusia five join the group in Ronda on Friday afternoon; Pilar meets them at Málaga. Clare and Raj join the Riviera walk at 14:00 with the others. Send the messages. Keep trying Ruth.',
      effects: [{ type: 'decide', id: 'joinup-AND', by: 'hannah' }, { type: 'approve-drafts', trip: 'AND' }, { type: 'approve-drafts', trip: 'RIV' }],
    },
    {
      id: 'e13', t: '2024-04-24T20:05:00+01:00', kind: 'decision', by: 'sam',
      text: 'Sent the transfer changes to Sur Travel (the five on SA 376) and Azur Ground (Clare and Raj).',
      effects: [{ type: 'decide', id: 'transfer-AND-1', by: 'sam' }, { type: 'decide', id: 'transfer-RIV-2', by: 'sam' }],
    },
    {
      id: 'e14', t: '2024-04-24T21:15:00+01:00', kind: 'private', from: 'Sur Travel (WhatsApp)', channel: 'whatsapp',
      text: 'All changes for the Fernway group are sorted 👍',
      effects: [{ type: 'dmc-general', dmc: 'sur' }],
    },
    {
      id: 'e15', t: '2024-04-25T09:05:00+01:00', kind: 'private', from: 'Sur Travel (WhatsApp)', channel: 'whatsapp',
      text: 'Friday 11:30 Málaga pickup for Dev M, Ian G, Nora Y, Paul Z, Amy C, then to Ronda. No booking change for Ruth K, we have nothing from her.',
      effects: [{ type: 'dmc-confirm', dmc: 'sur', guests: ['Dev M.', 'Ian G.', 'Nora Y.', 'Paul Z.', 'Amy C.'], what: 'Fri 11:30 pickup to Ronda' }],
    },
    {
      id: 'e16', t: '2024-04-25T11:00:00+01:00', kind: 'public',
      source: { label: 'Air Journal', url: 'https://www.air-journal.fr/2024-04-25-greve-annulee-des-controleurs-aeriens-ryanair-contrainte-dannuler-300-vols-malgre-tout-5255394.html', stamp: '25 Apr 12:00 CEST' },
      text: 'Ryanair says it cancelled more than 300 flights despite the strike being called off, most of them flights over France rather than to it.',
      effects: [{ type: 'news-scope', airport: 'overflights' }],
    },
    {
      id: 'e17', t: '2024-04-25T11:27:00+01:00', kind: 'public',
      source: { label: 'Associated Press, via CityNews', url: 'https://toronto.citynews.ca/2024/04/25/french-air-traffic-controllers-cancel-a-strike-but-paris-flights-are-still-disrupted/', stamp: '25 Apr 10:27 UTC' },
      text: 'Paris flights significantly disrupted despite the strike being cancelled. Cuts given as 75% at Orly, 55% at Charles de Gaulle, 65% at Marseille.',
      effects: [{ type: 'claim', subject: 'the cut at Charles de Gaulle', value: '55%', relevant: false }],
    },
    {
      id: 'e18b', t: '2024-04-25T12:20:00+01:00', kind: 'decision', by: 'hannah',
      text: "Agreed. Nadia, call Ruth's emergency contact now. Sur Travel to look out for her at Málaga arrivals. If we still have nothing by 18:00, I'll call the insurer's assistance line.",
      effects: [],
    },
    {
      id: 'e18', t: '2024-04-25T15:00:00+01:00', kind: 'private', from: 'Azur Ground (email)', channel: 'email',
      text: 'Confirmed: Clare F and Raj P, Fri 11:40 pickup Nice, Hotel Bellevue informed.',
      effects: [{ type: 'dmc-confirm', dmc: 'azur', guests: ['Clare F.', 'Raj P.'], what: 'Fri 11:40 pickup; hotel informed' }],
    },
    {
      id: 'e19', t: '2024-04-25T18:30:00+01:00', kind: 'private', from: 'Luc (WhatsApp)', channel: 'whatsapp',
      text: 'Six at welcome drinks: Priti, Leo, Emma, Kate, Sian, Ben. Brightwing 220 landed on time.',
      effects: [{ type: 'joined', trip: 'RIV', by: 'luc', guests: ['Priti S.', 'Leo H.', 'Emma L.', 'Kate D.', 'Sian M.', 'Ben A.'] }],
    },
    {
      id: 'e20', t: '2024-04-26T13:10:00+01:00', kind: 'private', from: 'Luc (WhatsApp)', channel: 'whatsapp',
      text: 'Aisha, Tom, Jen, Marcus, Clare and Raj all with us for lunch. Walking at 14:00, full group of twelve.',
      effects: [{ type: 'joined', trip: 'RIV', by: 'luc', guests: ['Aisha B.', 'Tom R.', 'Jen W.', 'Marcus O.', 'Clare F.', 'Raj P.'] }],
    },
    {
      id: 'e21', t: '2024-04-26T15:05:00+01:00', kind: 'private', from: 'Pilar (WhatsApp)', channel: 'whatsapp',
      text: 'Dev, Ian, Nora, Paul and Amy are with us in Ronda. Hugh, Lina, Zoe, Carl and Esme too. Still nothing from Ruth, her seat on the transfer was empty.',
      effects: [{ type: 'joined', trip: 'AND', by: 'pilar', guests: ['Dev M.', 'Ian G.', 'Nora Y.', 'Paul Z.', 'Amy C.', 'Hugh S.', 'Lina F.', 'Zoe B.', 'Carl W.', 'Esme D.'] }],
    },
    {
      id: 'e22', t: '2024-04-26T15:40:00+01:00', kind: 'private', from: 'Ruth K. (WhatsApp)', channel: 'whatsapp',
      text: "So sorry everyone, my phone died and I've been stuck at Heathrow. My flight was cancelled. I'm on BW 406 tomorrow, landing Málaga 11:00 Saturday.",
      effects: [{ type: 'flight', status: 'cancelled', flight: 'BW 402', guests: ['Ruth K.'], newArrival: 'BW 406, Sat 11:00 Málaga', from: 'Ruth herself' }],
    },
    {
      id: 'e23', t: '2024-04-26T15:50:00+01:00', kind: 'decision', by: 'sam',
      text: "Sent Ruth's new arrival to Sur Travel.",
      effects: [{ type: 'decide', id: 'transfer-AND-2', by: 'sam' }],
    },
    {
      id: 'e24', t: '2024-04-26T15:55:00+01:00', kind: 'decision', by: 'hannah',
      text: 'Approved the message to Ruth.',
      effects: [{ type: 'approve-drafts', trip: 'AND' }],
    },
    {
      id: 'e25', t: '2024-04-26T16:30:00+01:00', kind: 'private', from: 'Sur Travel (WhatsApp)', channel: 'whatsapp',
      text: 'Ruth K pickup booked Sat 11:30 Málaga, straight to the group.',
      effects: [{ type: 'dmc-confirm', dmc: 'sur', guests: ['Ruth K.'], what: 'Sat 11:30 pickup to the group' }],
    },
  ],
};
