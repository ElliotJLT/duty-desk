// The story view: three moments in a Slack incident channel. Guests and DMCs
// arrive through a WhatsApp bridge, because they won't join anyone's Slack.
// Each message is pinned to the scenario event it belongs to (`at`). The
// "Still open" pane and the approve buttons read the engine at that point;
// {placeholders} are filled from the engine and checked in tests.

export const moments = [
  {
    label: 'Monday',
    title: 'A strike notice for Thursday.',
    description: 'Fernway runs small-group trips. Guests book their own flights and meet the group on day one. Two groups start on Thursday.',
    takeaway: 'It started from the guests\' own flight details, so it spotted the Spain group and the missing form on day one.',
    without: 'The headline says France. The Spain group\'s flights fly over France too, and one form hadn\'t come back yet. Easy to miss with three trips running.',
    messages: [
      { at: 'e1', time: '13:00', kind: 'news', source: 'Air Journal', url: 'https://www.air-journal.fr/2024-04-22-greve-des-controleurs-aeriens-jusqua-70-de-vols-annules-jeudi-5255337.html',
        headline: 'French air traffic controllers file a strike notice for Thursday 25 April', sub: 'Up to 70% of flights at major airports could be cancelled.' },
      { at: 'e1', time: '13:01', kind: 'desk', text: 'I\'ve checked Thursday\'s flights from the guests\' pre-trip forms:',
        rows: [
          ['risk', 'Riviera coast walk', '9 guests landing in Nice on Thursday. 2 already in Menton.'],
          ['unknown', 'Emma L. (Riviera)', 'hasn\'t sent her travel details yet'],
          ['risk', 'Andalusia white villages', '6 guests on flights that cross France. 5 already in Spain.'],
          ['clear', 'Hebrides island hopper', 'nobody flying'],
        ],
        after: '@Nadia, could you ask Emma for her plans by Tuesday midday? Nothing to tell guests yet, as nothing\'s been cancelled.' },
      { at: 'e1', time: '13:06', kind: 'person', who: 'hannah', text: 'Andalusia\'s in Spain. Why is it on the list?' },
      { at: 'e1', time: '13:06', kind: 'desk', thread: true, text: 'Their flights pass over France, and a French air traffic strike can cancel those too.' },
      { at: 'e2', time: 'Tue 09:30', kind: 'external', from: 'Emma L.', via: 'WhatsApp', text: 'Sorry, forgot the form! I\'m on the train from Paris on Thursday, into Menton at 15:10.' },
      { at: 'e2', time: 'Tue 09:31', kind: 'desk', thread: true, text: 'Read from Emma\'s message: **train from Paris, arriving Menton Thu 15:10.** No flight, so she\'s not affected. Updated her form.' },
      { at: 'e3', time: 'Tue 10:05', kind: 'person', who: 'nadia', text: 'Aisha, Tom, Jen and Marcus have all messaged: SA 811 on Thursday is cancelled. They\'ve rebooked themselves on SA 815, landing Nice 12:10 Friday.' },
      { at: 'e3', time: 'Tue 10:06', kind: 'desk', text: 'Four Riviera guests now arrive on Friday. Their hotel is already paid for, so it\'s about getting them to the group.',
        actions: [
          { decision: 'transfer-RIV-1', label: 'Send to Azur Ground', ask: 'Move the four pickups to Friday 12:30 and ask Hotel Bellevue to hold their rooms.' },
          { decision: 'joinup-RIV', label: 'Approve', ask: 'Luc, the trip leader, suggests starting Friday\'s walk at 14:00 instead of 10:00 so all twelve walk together. Approve?' },
        ] },
      { at: 'e5', time: 'Tue 14:20', kind: 'external', from: 'Azur Ground', via: 'WhatsApp', text: 'Pickup booked Fri 12:30 Nice for Aisha B, Tom R, Jen W, Marcus O. Hotel Bellevue told they arrive Friday, rooms held.' },
      { at: 'e6', time: 'Tue 17:30', kind: 'desk', thread: true, text: 'Azur Ground has confirmed all four by name, so their pickups are set. @Hannah approved Luc\'s 14:00 start.' },
    ],
  },
  {
    label: 'Wednesday',
    title: 'The strike is called off.',
    description: 'Good news, but the airlines had already cut Thursday\'s flights, so the team keeps checking.',
    takeaway: 'It kept every guest on the list until their own plans were confirmed, and drafted a careful reply for Dev.',
    without: 'Everyone wants to tell guests it\'s fine. Dev\'s flight was cancelled that evening, and a quick "all sorted" from a busy local partner can\'t say who it covers.',
    messages: [
      { at: 'e7', time: '12:00', kind: 'news', source: 'Air Journal', url: 'https://www.air-journal.fr/2024-04-24-la-greve-des-controleurs-aeriens-ce-jeudi-annulee-a-la-derniere-minute-5255375.html',
        headline: 'Controllers lift Thursday\'s strike notice: "Un accord a été trouvé"', sub: 'Same article: airlines had already been told to cut Thursday flights, 60% at Nice and 50% at other French airports.' },
      { at: 'e7', time: '12:01', kind: 'desk', text: 'The strike\'s been called off. **I\'m keeping everyone on the list for now:** {open} guests aren\'t with their group yet, and the airlines haven\'t put Thursday\'s flights back.' },
      { at: 'e8', time: '12:40', kind: 'external', from: 'Dev M.', via: 'WhatsApp', text: 'Just seen the French strike\'s been called off. So we\'re all good for tomorrow morning?' },
      { at: 'e8', time: '12:41', kind: 'desk', thread: true, text: 'It\'s too early to say yes. Here\'s a draft for @Hannah:', draft: 'reply-dev' },
      { at: 'e9', time: '13:15', kind: 'news', source: 'Lyon Capitale', url: 'https://www.lyoncapitale.fr/actualite/45-des-vols-annules-a-l-aeroport-de-lyon-jeudi-malgre-la-levee-d-un-preavis-de-greve-des-controleurs',
        headline: '45% of Thursday\'s flights at Lyon cancelled despite the strike being called off' },
      { at: 'e10', time: '18:55', kind: 'person', who: 'nadia', text: 'Dev, Ian, Nora, Paul and Amy: SA 372 tomorrow is cancelled. All five rebooked themselves on SA 376, landing Málaga 11:00 Friday. Nothing from Ruth.' },
      { at: 'e11', time: '19:10', kind: 'external', from: 'Clare F.', via: 'WhatsApp', text: 'Our Brightwing flight tomorrow is cancelled. Raj and I are on BW 322 Friday instead, landing Nice 11:20.' },
      { at: 'e11', time: '19:11', kind: 'desk', text: 'Read from Clare\'s message: **Clare F. and Raj P., BW 322, landing Nice Fri 11:20.** That makes seven more guests arriving on Friday.',
        actions: [
          { decision: 'transfer-AND-1', label: 'Send to Sur Travel', ask: 'Move the five Andalusia pickups to Friday 11:30, straight to Ronda.' },
          { decision: 'transfer-RIV-2', label: 'Send to Azur Ground', ask: 'Add Clare and Raj to Friday, 11:40 from Nice.' },
          { decision: 'joinup-AND', label: 'Approve', ask: 'Pilar meets the five at Málaga and they join the group in Ronda on Friday afternoon?' },
        ],
        after: '@Nadia, Ruth\'s flight also passes over France and we haven\'t heard from her. Could you try her before Thursday midday?' },
      { at: 'e14', time: '21:15', kind: 'external', from: 'Sur Travel', via: 'WhatsApp', text: 'All changes for the Fernway group are sorted 👍' },
      { at: 'e14', time: '21:16', kind: 'desk', thread: true, text: 'Thanks, Sur Travel. To keep the list exact, I\'ve asked which guests that covers.' },
    ],
  },
  {
    label: 'Friday',
    title: 'Can we close it?',
    description: 'The late guests are joining their groups. Nobody has heard from Ruth since Monday.',
    takeaway: 'Each guest came off the list when the person with them said so. Ruth was followed up until she was found, and she stays on the list until she\'s with her group.',
    without: 'By Friday the news has moved on and everyone\'s tired. One quiet guest is easy to lose among dozens of messages.',
    messages: [
      { at: 'e15', time: 'Thu 09:05', kind: 'external', from: 'Sur Travel', via: 'WhatsApp', text: 'Friday 11:30 Málaga pickup for Dev M, Ian G, Nora Y, Paul Z, Amy C, then to Ronda. No booking change for Ruth K, we have nothing from her.' },
      { at: 'e15', time: 'Thu 09:06', kind: 'desk', thread: true, text: 'Thanks, Sur Travel. All five named, so their pickups are set. Noted you have nothing from Ruth either.' },
      { at: 'e18b', time: 'Thu 12:01', kind: 'desk', text: 'It\'s midday and nobody has heard from Ruth since Monday. Nadia has messaged and called twice. @Hannah, this needs you. Suggested next steps:',
        rows: [
          ['open', 'Her emergency contact', 'call the number on her booking form'],
          ['open', 'Sur Travel', 'look out for her at Málaga arrivals'],
          ['open', 'Insurer\'s assistance line', 'if there\'s still nothing by 18:00'],
        ] },
      { at: 'e18b', time: 'Thu 12:20', kind: 'person', who: 'hannah', text: 'Agreed. Nadia, call her emergency contact now. If we\'ve still nothing by 18:00, I\'ll call the insurer.' },
      { at: 'e19', time: 'Thu 18:30', kind: 'external', from: 'Luc', via: 'WhatsApp', text: 'Six at welcome drinks: Priti, Leo, Emma, Kate, Sian, Ben. Brightwing 220 landed on time.' },
      { at: 'e20', time: '13:10', kind: 'external', from: 'Luc', via: 'WhatsApp', text: 'Aisha, Tom, Jen, Marcus, Clare and Raj all with us for lunch. Walking at 14:00, full group of twelve.' },
      { at: 'e21', time: '15:05', kind: 'external', from: 'Pilar', via: 'WhatsApp', text: 'Dev, Ian, Nora, Paul and Amy are with us in Ronda. Hugh, Lina, Zoe, Carl and Esme too. Still nothing from Ruth, her seat on the transfer was empty.' },
      { at: 'e22', time: '15:40', kind: 'external', from: 'Ruth K.', via: 'WhatsApp', text: "So sorry everyone, my phone died and I've been stuck at Heathrow. My flight was cancelled. I'm on BW 406 tomorrow, landing Málaga 11:00 Saturday." },
      { at: 'e22', time: '15:41', kind: 'desk', thread: true, text: 'Ruth\'s safe. Read from her message: **BW 406, landing Málaga Sat 11:00.** I\'ve drafted a reply for @Hannah and a pickup request for Sur Travel.',
        actions: [
          { decision: 'transfer-AND-2', label: 'Send to Sur Travel', ask: 'Pickup for Ruth at Málaga, Sat 11:30, straight to the group.' },
        ] },
      { at: 'e25', time: '16:30', kind: 'external', from: 'Sur Travel', via: 'WhatsApp', text: 'Ruth K pickup booked Sat 11:30 Málaga, straight to the group.' },
      { at: 'e25', time: '16:31', kind: 'desk', text: '**{withGroup} of {affected}** guests on cancelled or changed flights are with their group, each confirmed by their trip leader.',
        rows: [
          ['ok', 'Riviera coast walk', 'all 12 walking together'],
          ['ok', 'Andalusia white villages', '10 in Ronda'],
          ['risk', 'Ruth K.', 'safe, landing Sat 11:00, pickup booked'],
        ] },
      { at: 'e25', time: '16:35', kind: 'person', who: 'hannah', text: 'Can we close this one?' },
      { at: 'e25', time: '16:35', kind: 'desk', thread: true, text: '**Not yet.** Ruth lands tomorrow at 11:00. She comes off the list when Pilar has her.' },
    ],
  },
];

export const people = {
  hannah: { name: 'Hannah', role: 'Head of operations', colour: '#C9524A' },
  sam: { name: 'Sam', role: 'Operations', colour: '#3E6675' },
  nadia: { name: 'Nadia', role: 'Guest care', colour: '#5E7F1F' },
};
