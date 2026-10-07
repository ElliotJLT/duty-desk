// The story view: three moments in a Slack incident channel. Guests and DMCs
// arrive through a WhatsApp bridge, because they won't join anyone's Slack.
// Each message is pinned to the scenario event it belongs to (`at`). The
// "Still open" pane and the approve buttons read the engine at that point;
// {placeholders} are filled from the engine and checked in tests.

export const moments = [
  {
    label: 'Monday',
    title: 'A strike notice for Thursday.',
    description: 'Fernway sells land-only trips, so guests book their own flights. Two groups start on Thursday.',
    takeaway: 'The desk starts from the flights guests gave us, not the headline. It finds a Spain trip at risk and a guest it knows nothing about.',
    without: 'Someone reads the headline and checks the French trip. The Andalusia flights cross France, and Emma never sent hers.',
    messages: [
      { at: 'e1', time: '13:00', kind: 'news', source: 'Air Journal', url: 'https://www.air-journal.fr/2024-04-22-greve-des-controleurs-aeriens-jusqua-70-de-vols-annules-jeudi-5255337.html',
        headline: 'French air traffic controllers file a strike notice for Thursday 25 April', sub: 'Up to 70% of flights at major airports could be cancelled.' },
      { at: 'e1', time: '13:01', kind: 'desk', text: 'Checked Thursday against the flights guests put on their pre-trip forms:',
        rows: [
          ['risk', 'Riviera coast walk', '9 guests landing in Nice on Thursday. 2 already in Menton.'],
          ['unknown', 'Emma L. (Riviera)', 'never sent her travel details'],
          ['risk', 'Andalusia white villages', '6 guests on flights that cross France. 5 already in Spain.'],
          ['clear', 'Hebrides island hopper', 'nobody flying'],
        ],
        after: '@Nadia, can you get Emma\'s plans by Tuesday midday? Nothing to tell guests yet: nothing\'s been cancelled.' },
      { at: 'e1', time: '13:06', kind: 'person', who: 'hannah', text: 'Andalusia? That\'s Spain.' },
      { at: 'e1', time: '13:06', kind: 'desk', thread: true, text: 'Their flights cross France. French strikes cancel flights over France, not just into it.' },
      { at: 'e2', time: 'Tue 09:30', kind: 'external', from: 'Emma L.', via: 'WhatsApp', text: 'Sorry, forgot the form! I\'m on the train from Paris on Thursday, into Menton at 15:10.' },
      { at: 'e2', time: 'Tue 09:31', kind: 'desk', thread: true, text: 'Emma\'s on the train. Not at risk.' },
      { at: 'e3', time: 'Tue 10:05', kind: 'person', who: 'nadia', text: 'Aisha, Tom, Jen and Marcus have all messaged: SA 811 on Thursday is cancelled. They\'ve rebooked themselves on SA 815, landing Nice 12:10 Friday.' },
      { at: 'e3', time: 'Tue 10:06', kind: 'desk', text: 'Four Riviera guests now arrive Friday. The hotel is already paid, so this is about getting them to the group.',
        actions: [
          { decision: 'transfer-RIV-1', label: 'Send to Azur Ground', ask: 'Move the four pickups to Friday 12:30 and ask Hotel Bellevue to hold their rooms.' },
          { decision: 'joinup-RIV', label: 'Approve', ask: 'Friday\'s walk starts at 10:00. Start it at 14:00 so all twelve walk together?' },
        ] },
      { at: 'e5', time: 'Tue 14:20', kind: 'external', from: 'Azur Ground', via: 'WhatsApp', text: 'Pickup booked Fri 12:30 Nice for Aisha B, Tom R, Jen W, Marcus O. Hotel Bellevue told they arrive Friday, rooms held.' },
      { at: 'e6', time: 'Tue 17:30', kind: 'desk', thread: true, text: 'All four named, so their transfers are confirmed. @Hannah approved the 14:00 start.' },
    ],
  },
  {
    label: 'Wednesday',
    title: 'The strike is called off.',
    description: 'It\'s true. But the airlines had already been told to cut Thursday\'s flights, and none of them has put one back.',
    takeaway: 'Good news about the cause isn\'t news about the guests. And "all sorted" isn\'t a confirmation until it names someone.',
    without: '"Strike\'s off, you\'re all good." Dev hears that at lunchtime and his flight is cancelled that evening. The DMC\'s "all sorted" gets ticked off.',
    messages: [
      { at: 'e7', time: '12:00', kind: 'news', source: 'Air Journal', url: 'https://www.air-journal.fr/2024-04-24-la-greve-des-controleurs-aeriens-ce-jeudi-annulee-a-la-derniere-minute-5255375.html',
        headline: 'Controllers lift Thursday\'s strike notice: "Un accord a été trouvé"', sub: 'Same article: airlines had already been told to cut Thursday flights, 60% at Nice and 50% at other French airports.' },
      { at: 'e7', time: '12:01', kind: 'desk', text: 'Strike called off. **I haven\'t closed anything.** {open} guests still aren\'t confirmed with their group, and the flight cuts aren\'t reported reversed.' },
      { at: 'e8', time: '12:40', kind: 'external', from: 'Dev M.', via: 'WhatsApp', text: 'Just seen the French strike\'s been called off. So we\'re all good for tomorrow morning?' },
      { at: 'e8', time: '12:41', kind: 'desk', thread: true, text: 'Can\'t say yes yet. Draft for @Hannah:', draft: 'reply-dev' },
      { at: 'e9', time: '13:15', kind: 'news', source: 'Lyon Capitale', url: 'https://www.lyoncapitale.fr/actualite/45-des-vols-annules-a-l-aeroport-de-lyon-jeudi-malgre-la-levee-d-un-preavis-de-greve-des-controleurs',
        headline: '45% of Thursday\'s flights at Lyon cancelled despite the strike being called off' },
      { at: 'e10', time: '18:55', kind: 'person', who: 'nadia', text: 'Dev, Ian, Nora, Paul and Amy: SA 372 tomorrow is cancelled. All five rebooked themselves on SA 376, landing Málaga 11:00 Friday. Nothing from Ruth.' },
      { at: 'e11', time: '19:10', kind: 'external', from: 'Clare F.', via: 'WhatsApp', text: 'Our Brightwing flight tomorrow is cancelled. Raj and I are on BW 322 Friday instead, landing Nice 11:20.' },
      { at: 'e11', time: '19:11', kind: 'desk', text: 'Seven more guests now arrive Friday.',
        actions: [
          { decision: 'transfer-AND-1', label: 'Send to Sur Travel', ask: 'Move the five Andalusia pickups to Friday 11:30, straight to Ronda.' },
          { decision: 'transfer-RIV-2', label: 'Send to Azur Ground', ask: 'Add Clare and Raj to Friday, 11:40 from Nice.' },
          { decision: 'joinup-AND', label: 'Approve', ask: 'Pilar meets the five at Málaga and they join the group in Ronda on Friday afternoon?' },
        ],
        after: '@Nadia, Ruth\'s flight crosses France too and she hasn\'t been in touch. Can you reach her by Thursday 12:00?' },
      { at: 'e14', time: '21:15', kind: 'external', from: 'Sur Travel', via: 'WhatsApp', text: 'All changes for the Fernway group are sorted 👍' },
      { at: 'e14', time: '21:16', kind: 'desk', thread: true, text: 'That names nobody, so **I haven\'t ticked off any transfer**. Asked Sur Travel to confirm each guest by name.' },
    ],
  },
  {
    label: 'Friday',
    title: 'Can we close it?',
    description: 'The late guests are catching up with their groups. Ruth hasn\'t answered anyone since Monday.',
    takeaway: 'The news moved on on Thursday. The room ends when the last guest is confirmed by the person standing with them.',
    without: 'Everyone rebooked, transfers "all sorted", incident closed. Nobody notices Ruth\'s empty seat on the transfer.',
    messages: [
      { at: 'e15', time: 'Thu 09:05', kind: 'external', from: 'Sur Travel', via: 'WhatsApp', text: 'Friday 11:30 Málaga pickup for Dev M, Ian G, Nora Y, Paul Z, Amy C, then to Ronda. No booking change for Ruth K, we have nothing from her.' },
      { at: 'e15', time: 'Thu 09:06', kind: 'desk', thread: true, text: 'Named all five. Transfers confirmed.' },
      { at: 'e19', time: 'Thu 18:30', kind: 'external', from: 'Luc', via: 'WhatsApp', text: 'Six at welcome drinks: Priti, Leo, Emma, Kate, Sian, Ben. Brightwing 220 landed on time.' },
      { at: 'e20', time: '13:10', kind: 'external', from: 'Luc', via: 'WhatsApp', text: 'Aisha, Tom, Jen, Marcus, Clare and Raj all with us for lunch. Walking at 14:00, full group of twelve.' },
      { at: 'e21', time: '15:05', kind: 'external', from: 'Pilar', via: 'WhatsApp', text: 'Dev, Ian, Nora, Paul and Amy are with us in Ronda. Hugh, Lina, Zoe, Carl and Esme too. Still nothing from Ruth, her seat on the transfer was empty.' },
      { at: 'e21', time: '15:06', kind: 'desk', text: '**{withGroup} of {affected}** guests on affected flights are with their group, each confirmed by their trip leader.',
        rows: [
          ['ok', 'Riviera coast walk', 'all 12 walking together'],
          ['ok', 'Andalusia white villages', '10 in Ronda'],
          ['open', 'Ruth K.', 'not reached since Monday. Overdue, with @Hannah'],
        ] },
      { at: 'e21', time: '15:10', kind: 'command', who: 'hannah', text: '/close' },
      { at: 'e21', time: '15:10', kind: 'desk', thread: true, text: '**Can\'t close yet.** Ruth K. hasn\'t been reached. The strike ending doesn\'t change that.' },
    ],
  },
];

export const people = {
  hannah: { name: 'Hannah', role: 'Duty Director', colour: '#C9524A' },
  sam: { name: 'Sam', role: 'Operations', colour: '#3E6675' },
  nadia: { name: 'Nadia', role: 'Guest care', colour: '#5E7F1F' },
};
