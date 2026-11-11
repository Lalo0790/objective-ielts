// Objective IELTS — original reading passages (written for this app; not IELTS material).
// Each passage: paragraphs A–E, headings (extra distractors), TFNG, summary gap fill, inference MCQ.
export const READING = [
{ id:'r1', level:'B1', title:'Bees Above the Traffic',
  paras:[
   'In many large cities, people who look up may notice small wooden boxes on the roofs of hotels, offices and schools. These are beehives. Over the last fifteen years, urban beekeeping has grown quickly, especially in Europe and North America, and it is now becoming popular in Latin American capitals such as Mexico City and Bogotá.',
   'At first, the idea seems strange. Cities are noisy, polluted and full of concrete. However, bees often do surprisingly well there. Parks, gardens, balconies and street trees offer a wide variety of flowers, and many cities use fewer agricultural chemicals than the countryside. As a result, some city hives produce more honey per year than hives on farms.',
   'Not everyone is enthusiastic. Some ecologists warn that honeybees compete with wild bees for the same flowers. Wild bees are often better pollinators of local plants, and many species are in decline. If too many hives are placed in one neighbourhood, there may simply not be enough food for everyone.',
   'For this reason, several cities have started to change their approach. Instead of only encouraging new hives, they now ask residents to plant native flowers and to leave small areas of ground undisturbed, where wild bees can build their nests. In Paris, for example, the number of new rooftop hives has been limited in some districts.',
   'Supporters say that the real value of city bees is educational. Schoolchildren who visit a rooftop hive learn where food comes from and why pollinators matter. A jar of local honey, they argue, can start a conversation about the environment that no textbook could.'
  ],
  headings:['A cautious response from local governments','An unexpected success story','Why honey is more expensive in cities','A trend spreading across continents','Lessons that go beyond honey','A hidden cost for other insects','The dangers of keeping bees at home'],
  headingAnswers:[3,1,5,0,4],
  tfng:[
   {s:'Urban beekeeping began in Latin America.',a:'F'},
   {s:'Some hives in cities make more honey than hives in the countryside.',a:'T'},
   {s:'Wild bees produce more honey than honeybees.',a:'NG'},
   {s:'Paris has restricted rooftop hives in certain areas.',a:'T'},
   {s:'Most city residents are afraid of bees.',a:'NG'}
  ],
  summary:{text:'City bees can find food in parks, gardens and [[1]]. However, honeybees may compete with [[2]] for flowers. Some cities now ask people to plant [[3]] flowers and to leave parts of the ground [[4]].',
    answers:[['balconies','street trees','balconies and street trees'],['wild bees'],['native'],['undisturbed']]},
  mcq:[
   {q:'What can we infer about the ecologists mentioned in paragraph C?',o:['They want to ban beekeeping completely.','They think the number of hives should be controlled.','They believe city flowers are polluted.','They prefer honey from farms.'],a:1},
   {q:'Why does the writer mention a jar of local honey in paragraph E?',o:['To show that city honey tastes better','To explain how honey is sold','To suggest that bees can help people learn about nature','To compare textbooks with real objects'],a:2}
  ]},
{ id:'r2', level:'B1', title:'The Return of the Bicycle',
  paras:[
   'In the 1950s, bicycles were one of the most common ways to travel in many cities. Workers rode to factories, children cycled to school and shops used bikes to deliver bread and milk. By the 1970s, however, cars had taken over the streets, and in many places cycling almost disappeared.',
   'The situation began to change in the early 2000s. Rising fuel prices, traffic jams and concerns about air quality made city leaders look for alternatives. Bike-sharing systems, where people can rent a bicycle for a short trip using a card or an app, appeared in Lyon in 2005 and in Paris two years later. Today there are more than a thousand such systems around the world.',
   'Building safe infrastructure has been essential. Studies show that most people will only cycle regularly if they feel protected from traffic. Painted lines on the road are not enough; physical barriers between cars and bikes make a much bigger difference. Cities that invested in separated lanes, such as Seville in Spain, saw cycling increase several times in less than a decade.',
   'There are still obstacles. In hot or hilly cities, many people find cycling tiring, and arriving at work sweaty is a real concern. Electric bicycles are helping to solve this problem, because they make hills and long distances much easier, although they are more expensive to buy and to maintain.',
   'Experts believe that the bicycle will not replace public transport, but it can work together with it. A short ride from home to a metro station, followed by a train journey, is often faster than driving across a crowded city.'
  ],
  headings:['Why safety comes first','Electric bikes and the problem of hills','A golden age that ended','The cheapest way to get fit','A partner, not a competitor','How sharing schemes changed the picture','Accidents involving cyclists'],
  headingAnswers:[2,5,0,1,4],
  tfng:[
   {s:'Shops in the 1950s sometimes delivered food by bicycle.',a:'T'},
   {s:'The first bike-sharing system in the passage started in Paris.',a:'F'},
   {s:'Painted lanes are as effective as physical barriers.',a:'F'},
   {s:'Seville is the city with the most cyclists in Europe.',a:'NG'},
   {s:'Electric bicycles cost more to maintain than ordinary bicycles.',a:'T'}
  ],
  summary:{text:'Bike-sharing allows people to rent a bicycle for a [[1]] trip. Cities that built [[2]] lanes saw large increases in cycling. In hot or [[3]] cities, electric bikes help, and a bike ride combined with a [[4]] journey can be faster than driving.',
    answers:[['short'],['separated'],['hilly'],['train','metro']]},
  mcq:[
   {q:'What is the main idea of paragraph C?',o:['Cyclists should follow traffic rules.','Feeling safe is key to getting people to cycle.','Seville spent too much money on lanes.','Painted lines are cheap to maintain.'],a:1},
   {q:'Which statement would the writer most likely agree with?',o:['Cities should stop investing in metros.','Bicycles are only useful in flat cities.','Cycling works best as part of a wider transport system.','Electric bikes will soon be cheaper than cars.'],a:2}
  ]},
{ id:'r3', level:'B1', title:'Why Teenagers Need More Sleep',
  paras:[
   'Many parents complain that their teenage children stay up late and are impossible to wake in the morning. It is easy to see this as laziness, but scientists now believe that biology plays a major role. During adolescence, the body releases melatonin, the hormone that makes us feel sleepy, about two hours later than it does in childhood.',
   'This change creates a conflict with school timetables. If a sixteen-year-old cannot fall asleep before midnight but has to get up at six, they will regularly sleep less than the eight to ten hours that doctors recommend. Over weeks and months, this lack of sleep builds up.',
   'The effects are not only physical. Research has linked short sleep to poorer memory, lower concentration and greater difficulty controlling emotions. One study found that students who slept less than seven hours were more likely to report feeling sad or anxious than those who slept nine hours.',
   'Some schools have experimented with later start times. When a group of schools in the United States moved their first class from 7:30 to 8:30, attendance improved and students reported feeling more alert. Interestingly, most students did not simply go to bed later; they used the extra hour to sleep.',
   'Changing school hours is complicated, because it affects buses, parents\' jobs and after-school activities. Even so, experts say families can help by keeping phones out of bedrooms at night and by keeping a similar sleep schedule at weekends.'
  ],
  headings:['What happened when classes began later','A body clock that moves','Practical steps for families','Teenagers who sleep too much','More than just tiredness','A timetable that does not fit','The history of the school day'],
  headingAnswers:[1,5,4,0,2],
  tfng:[
   {s:'Teenagers produce melatonin later in the evening than young children.',a:'T'},
   {s:'Doctors recommend at least ten hours of sleep for teenagers.',a:'F'},
   {s:'Lack of sleep can make it harder to manage feelings.',a:'T'},
   {s:'Students who started school later went to bed one hour later.',a:'F'},
   {s:'Most parents support later school start times.',a:'NG'}
  ],
  summary:{text:'The hormone [[1]] is released later during adolescence. Short sleep is linked to weaker [[2]] and concentration. In one experiment, a later start improved [[3]]. Experts suggest keeping [[4]] out of bedrooms.',
    answers:[['melatonin'],['memory'],['attendance'],['phones']]},
  mcq:[
   {q:'Why does the writer say it is "easy to see this as laziness" in paragraph A?',o:['To agree with parents','To introduce a common belief that the passage challenges','To criticise teenagers','To describe a scientific finding'],a:1},
   {q:'What does the word "Interestingly" in paragraph D suggest?',o:['The result was surprising.','The study was badly designed.','Students were not interested.','The schools changed their minds.'],a:0}
  ]},
{ id:'r4', level:'B1', title:'Apps Against Food Waste',
  paras:[
   'Around a third of all food produced in the world is never eaten. Some of it is lost on farms or during transport, but a large amount is thrown away by shops, restaurants and households. At the same time, millions of people do not have enough to eat.',
   'In recent years, a new type of business has tried to tackle this problem with smartphones. Apps such as surplus-food marketplaces allow bakeries, cafés and supermarkets to sell food that is close to its best-before date at a much lower price. Customers reserve a "surprise bag" in the app and collect it at the end of the day.',
   'For businesses, the benefit is clear: they recover part of the cost of food that would otherwise go in the bin. For customers, it is a cheap meal and a small adventure, because they rarely know exactly what they will get. Many users say that the surprise element is part of the fun.',
   'Critics point out, however, that these apps do not address the main causes of waste. Supermarkets may still order too much, knowing that they can sell the extra at the end of the day. In addition, some food that was previously donated to charities is now sold instead.',
   'Despite these concerns, researchers agree that the apps have made the public more aware of the issue. Changing habits at home, such as planning meals and storing food correctly, remains the most effective way to reduce waste.'
  ],
  headings:['Benefits on both sides of the counter','The size of the problem','How surprise bags work','Why some people are not convinced','The power of awareness and home habits','Supermarkets that donate everything','How farmers lose food'],
  headingAnswers:[1,2,0,3,4],
  tfng:[
   {s:'About one third of food produced globally is wasted.',a:'T'},
   {s:'Customers can choose exactly what goes into a surprise bag.',a:'F'},
   {s:'The apps were first developed in Denmark.',a:'NG'},
   {s:'Some charities may receive less food because of the apps.',a:'T'},
   {s:'Researchers believe the apps are the best way to reduce waste.',a:'F'}
  ],
  summary:{text:'Businesses use the apps to sell food near its [[1]] date. Customers reserve a [[2]] and collect it later. Critics say shops may still [[3]] too much. The most effective solution is changing habits at home, like planning [[4]].',
    answers:[['best-before','best before'],['surprise bag'],['order'],['meals']]},
  mcq:[
   {q:'Why do many users enjoy the apps, according to paragraph C?',o:['They help charities.','The food is healthier.','Not knowing the contents is exciting.','They can eat in the restaurant.'],a:2},
   {q:'What is the writer\'s overall view of the apps?',o:['They are useless.','They are helpful but not a complete solution.','They should replace charities.','They are too expensive.'],a:1}
  ]},
{ id:'r5', level:'B1+', title:'Gardeners of the Reef',
  paras:[
   'Coral reefs cover less than one percent of the ocean floor, yet they support roughly a quarter of all marine species. They also protect coastlines from storms and provide food and income for hundreds of millions of people. Unfortunately, reefs are under serious threat, mainly because of rising sea temperatures.',
   'When the water becomes too warm, corals expel the tiny algae that live inside them and give them their colour and most of their energy. This process, known as bleaching, leaves the coral white and weak. If temperatures return to normal quickly, the coral can recover; if not, it may die.',
   'In response, scientists and volunteers have begun "coral gardening". Small fragments of healthy coral are grown on underwater frames, a little like plants in a nursery, and are later attached to damaged parts of the reef. In the Mexican Caribbean, projects of this kind have replanted tens of thousands of fragments.',
   'Researchers are also searching for corals that tolerate heat better. By identifying and breeding these more resilient individuals, they hope to give reefs a better chance of surviving future heatwaves. Some laboratories are even testing whether corals can be "trained" by exposing them gradually to warmer water.',
   'Nevertheless, most experts insist that restoration can only buy time. Without significant reductions in greenhouse gas emissions, they argue, even the most successful projects will struggle to keep pace with the damage.'
  ],
  headings:['Searching for tougher corals','Small area, enormous importance','Tourism and the reef economy','Growing coral like plants','What happens when the sea heats up','A temporary solution at best','Fishing rules around reefs'],
  headingAnswers:[1,4,3,0,5],
  tfng:[
   {s:'Coral reefs are home to about 25% of marine species.',a:'T'},
   {s:'Bleached coral always dies.',a:'F'},
   {s:'Coral gardening projects in Mexico use volunteers from other countries.',a:'NG'},
   {s:'Some scientists are testing whether coral can adapt to gradually warmer water.',a:'T'},
   {s:'Experts believe restoration alone can save the reefs.',a:'F'}
  ],
  summary:{text:'Warm water causes corals to lose the [[1]] that live inside them, a process called [[2]]. In coral gardening, fragments are grown on underwater [[3]]. Scientists are also breeding more [[4]] corals.',
    answers:[['algae','tiny algae'],['bleaching'],['frames'],['resilient','heat-tolerant']]},
  mcq:[
   {q:'The phrase "buy time" in paragraph E most likely means:',o:['spend money','delay the problem','solve the problem','waste time'],a:1},
   {q:'What can be inferred from paragraph B?',o:['Algae are harmful to coral.','The speed of temperature change affects recovery.','White coral is a new species.','Bleaching only happens in Mexico.'],a:1}
  ]},
{ id:'r6', level:'B1+', title:'Working From Anywhere',
  paras:[
   'Before 2020, working from home was a privilege enjoyed by relatively few employees. Within a few months, the global pandemic turned it into a necessity for millions. Although many offices have since reopened, a significant proportion of workers now spend at least part of the week at home.',
   'One unexpected consequence has been the movement of people from large cities to smaller towns. Freed from the daily commute, some workers chose cheaper housing, more space and a quieter lifestyle. In several countries, rural areas that had been losing population for decades suddenly saw new arrivals.',
   'This migration has brought benefits to local economies, as newcomers spend money in shops and restaurants. However, it has also caused tension. In popular destinations, house prices and rents rose quickly, making it harder for local young people to stay in the place where they grew up.',
   'Companies remain divided on the issue. Some report that productivity has stayed the same or even improved, while others worry about the loss of informal learning that happens when colleagues sit together. Junior employees, in particular, may miss opportunities to learn by watching more experienced workers.',
   'Many organisations have therefore adopted a hybrid model, combining office days with home days. Whether this compromise will last, or whether one model will eventually dominate, is still unclear.'
  ],
  headings:['From rare to normal','A divided business world','New life for the countryside','The search for a middle way','The environmental cost of commuting','Winners and losers in small towns','Why offices are closing forever'],
  headingAnswers:[0,2,5,1,3],
  tfng:[
   {s:'Before 2020, most employees worked from home regularly.',a:'F'},
   {s:'Some rural areas gained population after years of decline.',a:'T'},
   {s:'Rents increased in some popular towns.',a:'T'},
   {s:'All companies report lower productivity among home workers.',a:'F'},
   {s:'The hybrid model is most common in technology companies.',a:'NG'}
  ],
  summary:{text:'Without a daily [[1]], some workers moved to smaller towns for cheaper housing. Newcomers helped local [[2]], but higher prices affected local [[3]]. Some companies fear losing [[4]] learning between colleagues.',
    answers:[['commute'],['economies','shops'],['young people'],['informal']]},
  mcq:[
   {q:'Why does the writer mention junior employees in paragraph D?',o:['They are the most productive group.','They may lose the most from not being in an office.','They prefer working from home.','They are moving to rural areas.'],a:1},
   {q:'What is the tone of the final paragraph?',o:['Certain','Angry','Uncertain','Humorous'],a:2}
  ]},
{ id:'r7', level:'B1+', title:'The Hidden Logic of Habits',
  paras:[
   'Psychologists estimate that a large part of what we do each day is not the result of conscious decisions but of habits. Brushing our teeth, checking our phones and taking the same route to school are behaviours that happen almost automatically, freeing the brain to concentrate on other things.',
   'Researchers often describe a habit as a loop with three parts. First, there is a cue, such as a time of day, a place or a feeling. Then comes the routine, the behaviour itself. Finally, there is a reward, which teaches the brain that the loop is worth repeating.',
   'A popular belief is that it takes exactly 21 days to form a new habit. However, a study at a university in London found that the average was closer to 66 days, and the range was enormous: from 18 days to more than eight months, depending on the person and the behaviour.',
   'Understanding the loop can help people change unwanted behaviour. Rather than trying to remove a bad habit by willpower alone, experts recommend keeping the same cue and reward but replacing the routine. Someone who eats snacks when stressed, for example, might go for a short walk instead.',
   'Environment also matters more than many people realise. Placing a book on your pillow or leaving your running shoes by the door makes the desired behaviour easier, while putting your phone in another room makes distraction harder.'
  ],
  headings:['Designing your surroundings','The three-step cycle','A myth about timing','Swapping the middle step','Why habits are difficult to break','The brain on autopilot','Rewards that make us unhappy'],
  headingAnswers:[5,1,2,3,0],
  tfng:[
   {s:'Habits allow the brain to focus on other tasks.',a:'T'},
   {s:'A reward comes before the routine in the habit loop.',a:'F'},
   {s:'The London study found that habits take 66 days on average to form.',a:'T'},
   {s:'Willpower is the most effective way to stop a bad habit.',a:'F'},
   {s:'Reading before bed improves sleep quality.',a:'NG'}
  ],
  summary:{text:'A habit loop starts with a [[1]], followed by a routine and a [[2]]. The idea that habits take 21 days is a [[3]]. To change a habit, keep the cue and reward but replace the [[4]].',
    answers:[['cue'],['reward'],['myth','popular belief'],['routine']]},
  mcq:[
   {q:'What does the example of the running shoes show?',o:['Exercise is a good habit.','Making a behaviour easier increases the chance of doing it.','Shoes should be kept outside.','People forget their shoes.'],a:1},
   {q:'Which word best describes the range of results in the London study?',o:['narrow','predictable','wide','exact'],a:2}
  ]},
{ id:'r8', level:'B1+', title:'A City That Is Sinking',
  paras:[
   'Mexico City was built on the bed of an ancient lake. When the Spanish arrived in the sixteenth century, the Aztec capital, Tenochtitlan, stood on an island surrounded by water. Over the following centuries, the lake was gradually drained to make room for the growing city.',
   'Today, the city faces a surprising problem: it is sinking. In some neighbourhoods, the ground drops by more than thirty centimetres a year. The main cause is the extraction of water from underground aquifers to supply more than twenty million people. As the water is removed, the soft clay beneath the city compresses.',
   'The effects are visible everywhere. Historic churches lean at strange angles, pipes crack and streets develop dangerous dips. Broken pipes, in turn, lose a large share of the water that passes through them, which means even more must be pumped from underground.',
   'Engineers have proposed several solutions. These include capturing rainwater from rooftops, repairing leaks and recharging aquifers by allowing water to soak back into the ground in parks and green areas. Some of these projects are already under way, although progress is slow.',
   'The situation is a powerful reminder that cities depend on the natural systems beneath them. What happens underground, out of sight, can shape the future of millions of people above.'
  ],
  headings:['A vicious circle of damage','Built on water','Hope from the rain','Why the ground is falling','Earthquakes and building rules','Lessons from below the surface','The cost of bottled water'],
  headingAnswers:[1,3,0,2,5],
  tfng:[
   {s:'Tenochtitlan was built on an island.',a:'T'},
   {s:'Every part of Mexico City sinks at the same speed.',a:'F'},
   {s:'Cracked pipes increase the need to pump groundwater.',a:'T'},
   {s:'Rainwater capture projects have completely solved the problem.',a:'F'},
   {s:'Other Latin American cities have the same problem.',a:'NG'}
  ],
  summary:{text:'Water is taken from underground [[1]], which makes the soft [[2]] compress. Broken pipes lose a large [[3]] of their water. Solutions include repairing [[4]] and capturing rainwater.',
    answers:[['aquifers'],['clay'],['share'],['leaks']]},
  mcq:[
   {q:'Why does the writer describe broken pipes in paragraph C?',o:['To show how one problem makes another worse','To blame the government','To describe old churches','To explain the history of the lake'],a:0},
   {q:'What is the purpose of the last paragraph?',o:['To give statistics','To offer a broader lesson','To propose a new law','To describe Aztec culture'],a:1}
  ]},
{ id:'r9', level:'B2', title:'Saving Languages From Silence',
  paras:[
   'Of the roughly seven thousand languages spoken today, linguists estimate that around forty percent are endangered, meaning they are no longer being passed on fully to children. When the last fluent speaker of a language dies, an entire way of describing the world may disappear with them.',
   'Languages are lost for many reasons. Historically, some governments actively discouraged or even banned minority languages in schools. More often today, the pressure is economic: parents may believe that their children will have better opportunities if they grow up speaking a dominant national or global language instead.',
   'The consequences extend beyond culture. Many indigenous languages contain detailed knowledge about local plants, animals and weather patterns, accumulated over generations. Researchers have found that some plant names encode information about medicinal uses that is not recorded anywhere else.',
   'Revitalisation efforts have had notable successes. Hebrew, which for centuries was used mainly in religious contexts, became the everyday language of millions in the twentieth century. More recently, communities have created "language nests", where young children spend the day with elderly fluent speakers, and digital tools that allow learners to practise using apps and online dictionaries.',
   'Nonetheless, revitalisation is rarely straightforward. It requires sustained funding, trained teachers and, above all, a community that sees value in using the language in daily life, not merely preserving it as a museum piece.'
  ],
  headings:['Knowledge stored in words','A shrinking linguistic map','The ingredients of lasting success','Why parents choose other languages','Remarkable comebacks','Languages that are easy to learn','How dictionaries are written'],
  headingAnswers:[1,3,0,4,2],
  tfng:[
   {s:'Around 40% of the world\'s languages are endangered.',a:'T'},
   {s:'Economic factors are now the main reason languages disappear.',a:'T'},
   {s:'All indigenous plant names have been recorded by scientists.',a:'F'},
   {s:'Hebrew is now spoken by more people than any other revived language.',a:'NG'},
   {s:'Recording a language is enough to keep it alive.',a:'F'}
  ],
  summary:{text:'A language is endangered when it is not passed on to [[1]]. Indigenous languages often contain knowledge about plants and [[2]] patterns. In "language [[3]]", children spend time with elderly speakers. Success needs funding, teachers and a committed [[4]].',
    answers:[['children'],['weather'],['nests'],['community']]},
  mcq:[
   {q:'The phrase "a museum piece" in paragraph E suggests a language that is:',o:['beautifully written','kept but not actually used','very old and valuable','studied by experts'],a:1},
   {q:'Which statement best summarises the writer\'s view?',o:['Language loss is inevitable.','Revitalisation is possible but demanding.','Technology alone can save languages.','Governments should choose one language.'],a:1}
  ]},
{ id:'r10', level:'B2', title:'The Plastic We Cannot See',
  paras:[
   'Microplastics are fragments of plastic smaller than five millimetres. Some are manufactured at this size, such as the tiny beads once common in face scrubs, but most are created when larger items, from bottles to synthetic clothing, break down under sunlight, waves and friction.',
   'These particles have now been detected almost everywhere scientists have looked: in deep-sea sediments, Arctic ice, agricultural soil and even the air of remote mountain regions. Studies have also found them in drinking water, salt and human blood, although researchers stress that the health implications are not yet fully understood.',
   'A surprising source is laundry. Each time synthetic fabrics such as polyester are washed, thousands of microscopic fibres can be released into the water. Because these fibres are so small, many pass through treatment plants and end up in rivers and seas.',
   'Governments have begun to respond. Several countries have banned microbeads in cosmetics, and some are considering requiring washing machines to be fitted with filters. Scientists are also experimenting with bacteria and enzymes capable of breaking plastic down into harmless substances.',
   'Ultimately, however, many researchers argue that the most reliable strategy is to reduce plastic production in the first place. Cleaning up particles that are already scattered across the planet, they warn, would be an almost impossible task.'
  ],
  headings:['Prevention rather than cure','Everywhere we search','Policies and laboratory solutions','What counts as a microplastic','A problem in the washing machine','Why plastic is so cheap','Fish that eat plastic'],
  headingAnswers:[3,1,4,2,0],
  tfng:[
   {s:'Most microplastics come from larger pieces breaking down.',a:'T'},
   {s:'Scientists have proven that microplastics cause serious diseases.',a:'F'},
   {s:'Microplastics have been found in the air of remote mountains.',a:'T'},
   {s:'Washing machine filters are compulsory in every European country.',a:'NG'},
   {s:'Researchers think cleaning up existing microplastics would be easy.',a:'F'}
  ],
  summary:{text:'Microplastics are smaller than five [[1]]. Washing [[2]] fabrics releases tiny fibres that pass through treatment [[3]]. Some scientists are testing bacteria and [[4]] to break plastic down.',
    answers:[['millimetres','millimeters','mm'],['synthetic'],['plants'],['enzymes']]},
  mcq:[
   {q:'Why does the writer mention human blood in paragraph B?',o:['To prove plastic is toxic','To show how widespread microplastics are','To recommend medical tests','To criticise researchers'],a:1},
   {q:'The word "Ultimately" in paragraph E introduces:',o:['a final, most important point','a surprising example','a historical fact','a counter-argument the writer rejects'],a:0}
  ]},
{ id:'r11', level:'B2', title:'Who Chooses Your Next Song?',
  paras:[
   'For most of the twentieth century, the music people discovered depended largely on radio presenters, record shop staff and friends. Today, for hundreds of millions of listeners, that role is increasingly played by recommendation algorithms built into streaming platforms.',
   'These systems typically combine two approaches. The first analyses listening behaviour: if people who enjoy song A also tend to enjoy song B, a new fan of A will probably be offered B. The second examines the audio itself, measuring features such as tempo, energy and instrumentation to find tracks that sound similar.',
   'Supporters argue that algorithms have democratised discovery. An unknown artist recording in a bedroom can, in theory, reach a global audience without the backing of a major label. Personalised playlists can also introduce listeners to genres they would never have searched for deliberately.',
   'Critics, however, warn of a "filter bubble". Because algorithms tend to reward what is already popular or familiar, they may narrow rather than broaden taste over time. Some musicians also report feeling pressure to write songs that fit the patterns algorithms favour, such as short introductions that grab attention within seconds.',
   'Some platforms have responded by adding features that deliberately inject variety, while many listeners combine algorithmic suggestions with human sources such as music journalists and friends. The question of who, or what, shapes cultural taste is likely to remain contested.'
  ],
  headings:['Two ways a machine listens','Equal chances for new artists?','From human guides to code','The risk of hearing more of the same','Mixing machines and people','The rising price of streaming','Concerts in the digital age'],
  headingAnswers:[2,0,1,3,4],
  tfng:[
   {s:'Radio presenters once had a major influence on music discovery.',a:'T'},
   {s:'Recommendation systems only analyse the sound of songs.',a:'F'},
   {s:'Bedroom artists now earn more than artists with major labels.',a:'NG'},
   {s:'Some musicians change how they write songs because of algorithms.',a:'T'},
   {s:'All platforms have stopped using algorithms.',a:'F'}
  ],
  summary:{text:'One approach studies listening [[1]]; another measures features like tempo and [[2]]. Critics warn of a filter [[3]]. Some songs now have short [[4]] to catch attention quickly.',
    answers:[['behaviour','behavior'],['energy','instrumentation'],['bubble'],['introductions','intros']]},
  mcq:[
   {q:'The phrase "in theory" in paragraph C suggests that:',o:['this always happens','this is possible but may not often happen','scientists have proved it','it is against the law'],a:1},
   {q:'What is the writer\'s position in the final paragraph?',o:['Algorithms are clearly harmful.','Humans should not use streaming.','The debate is unresolved.','Journalists are no longer needed.'],a:2}
  ]},
{ id:'r12', level:'B2', title:'Traffic Jam in Orbit',
  paras:[
   'Since the launch of the first artificial satellite in 1957, humans have sent thousands of objects into orbit around the Earth. Many are still there long after they stopped working. Together with fragments from collisions and explosions, they form what is known as space debris.',
   'The danger comes from speed. In low Earth orbit, objects travel at around 28,000 kilometres per hour, so even a piece of metal the size of a coin can strike with the force of a bullet. The International Space Station regularly changes its position to avoid potential collisions.',
   'Scientists are particularly concerned about a scenario first described in the 1970s, in which one collision creates fragments that cause further collisions, producing a chain reaction. In the worst case, certain orbits could become so crowded with debris that they would be unusable for generations.',
   'The rapid growth of satellite networks designed to provide global internet access has intensified these worries. Thousands of new satellites have been launched in only a few years, and many more are planned. Operators insist that their satellites are designed to burn up in the atmosphere at the end of their lives.',
   'Possible solutions range from nets and harpoons that could capture dead satellites to stricter international rules requiring operators to remove their spacecraft after use. Yet without agreement among the major space-faring nations, experts fear that progress will remain limited.'
  ],
  headings:['A chain reaction in the sky','Why size can be misleading','The internet race and its consequences','Rubbish left behind','Cooperation as the missing piece','The first astronauts','Building stations on the Moon'],
  headingAnswers:[3,1,0,2,4],
  tfng:[
   {s:'The first artificial satellite was launched in 1957.',a:'T'},
   {s:'Small pieces of debris are harmless because of their size.',a:'F'},
   {s:'The ISS has been hit by debris more than ten times.',a:'NG'},
   {s:'Internet satellite networks have increased concern about debris.',a:'T'},
   {s:'Experts are confident that progress will be fast.',a:'F'}
  ],
  summary:{text:'Objects in low Earth orbit travel at about 28,000 [[1]] per hour. One collision could start a chain [[2]]. Proposed solutions include nets and [[3]], as well as stricter international [[4]].',
    answers:[['kilometres','kilometers','km'],['reaction'],['harpoons'],['rules']]},
  mcq:[
   {q:'Why does the writer compare a coin-sized object to a bullet?',o:['To show how fast and dangerous debris is','To describe weapons in space','To explain satellite design','To compare costs'],a:0},
   {q:'What can be inferred about satellite operators in paragraph D?',o:['They ignore the problem.','They claim their satellites will not add to long-term debris.','They want fewer satellites.','They support nets and harpoons.'],a:1}
  ]}
];

// Short inference texts (Friday). Each set: 3 micro-texts with an inference question.
export const INFERENCE = [
 [ {t:'Notice: The school library will close at 3 pm on Friday instead of 6 pm. Students who need to return books may use the box outside the main entrance.',q:'What can we infer?',o:['The library is closed all Friday.','Students can still return books after 3 pm.','The library is moving.'],a:1},
   {t:'Marta had studied for weeks, but when she saw the first question she smiled and put her pen down for a moment before starting to write quickly.',q:'How did Marta probably feel?',o:['Confident','Confused','Bored'],a:0},
   {t:'The café\'s new menu has no prices on it. A small note says: "Pay what you think it was worth."',q:'What is the café trying to do?',o:['Save money on printing','Let customers decide the price','Sell only free food'],a:1} ],
 [ {t:'Despite the heavy rain, the stadium was almost full, and the noise did not stop for ninety minutes.',q:'What can we infer about the fans?',o:['They were very enthusiastic.','They left early.','They were angry about the weather.'],a:0},
   {t:'"I\'d love to come," said Leo, looking at the calendar on his phone, "but I\'ve already promised my grandmother."',q:'What does Leo mean?',o:['He will come later.','He cannot come.','He forgot the date.'],a:1},
   {t:'The museum asks visitors to leave large bags at the entrance and does not allow photos with flash.',q:'Why are these rules most likely in place?',o:['To protect the exhibits','To sell more tickets','To make visits shorter'],a:0} ],
 [ {t:'The app was downloaded a million times in its first week, but by the end of the month most users had deleted it.',q:'What does this suggest?',o:['The app was impossible to find.','Initial interest did not last.','The app was too cheap.'],a:1},
   {t:'Every plant on the balcony was brown except the cactus.',q:'What can we infer?',o:['The plants got too much water.','The plants probably did not get enough water.','The cactus is new.'],a:1},
   {t:'The teacher wrote "Interesting idea — but where is your evidence?" next to Ana\'s paragraph.',q:'What does the teacher want?',o:['A shorter paragraph','Support for the idea','A different topic'],a:1} ],
 [ {t:'Tickets for the concert sold out in four minutes; two hours later, they were being resold online for five times the price.',q:'What can be inferred?',o:['Demand was much higher than supply.','The concert was cancelled.','The band is not popular.'],a:0},
   {t:'Pedro checked the weather three times, packed an extra jacket and left an hour early.',q:'What kind of person is Pedro?',o:['Careless','Cautious','Lazy'],a:1},
   {t:'The company\'s profits rose, yet it announced that it would close two factories.',q:'What does "yet" signal here?',o:['A result','A contrast','An example'],a:1} ],
 [ {t:'Although the restaurant has only six tables, you need to book about a month in advance.',q:'What can we infer?',o:['It is very popular.','It is very cheap.','It is closed most of the month.'],a:0},
   {t:'The volunteers arrived with gloves, bags and long sticks with metal points.',q:'What were they probably going to do?',o:['Plant trees','Collect rubbish','Paint a wall'],a:1},
   {t:'"It\'s not that I don\'t like the plan," said the manager. "I just wonder whether we can afford it right now."',q:'What is the manager\'s main concern?',o:['The quality of the plan','The cost','The timing of the meeting'],a:1} ],
 [ {t:'In the photo from 1990 the street is full of cars; in the 2025 photo, the same street has trees, benches and children playing.',q:'What most likely happened?',o:['The street was pedestrianised.','The city lost population.','Cars became illegal everywhere.'],a:0},
   {t:'Sara read the email, sighed, and moved her weekend plans to the following month.',q:'What was the email probably about?',o:['Extra work or a new obligation','A surprise holiday','A birthday party'],a:0},
   {t:'The label says "Best served chilled. Shake well before opening."',q:'What kind of product is it?',o:['A drink','A shampoo','A frozen pizza'],a:0} ],
 [ {t:'The study included only 30 participants, all from the same university.',q:'What weakness does this suggest?',o:['The results may not apply to everyone.','The study was too expensive.','The participants were too old.'],a:0},
   {t:'Few people expected the small team to win, so the celebrations in the town lasted all night.',q:'What can we infer?',o:['The victory was a surprise.','The team always wins.','Nobody cared about the result.'],a:0},
   {t:'The novel was rejected by twelve publishers before it became a bestseller.',q:'What does this suggest?',o:['Publishers can misjudge success.','The novel was badly written.','Bestsellers are easy to write.'],a:0} ],
 [ {t:'The politician avoided the journalist\'s question and began talking about his childhood.',q:'What can be inferred?',o:['He did not want to answer.','He did not hear the question.','He was asked about his childhood.'],a:0},
   {t:'Since the factory closed, many young people have left the town to find work elsewhere.',q:'What is the relationship described?',o:['Cause and effect','Comparison','Definition'],a:0},
   {t:'The tour guide spoke slowly, repeated key words and often pointed at objects.',q:'Who were the tourists probably?',o:['Language learners or foreign visitors','Experts in history','Children under five'],a:0} ],
 [ {t:'The report describes the new policy as "ambitious", noting that its targets "have not been achieved anywhere else".',q:'What is the writer\'s attitude?',o:['Slightly doubtful','Completely negative','Extremely enthusiastic'],a:0},
   {t:'Researchers found that people walked faster in cities with larger populations.',q:'Which conclusion is best supported?',o:['City size may influence behaviour.','Large cities are healthier.','People in small towns are lazy.'],a:0},
   {t:'"I wouldn\'t call it a failure," said the scientist. "We learned exactly what doesn\'t work."',q:'How does the scientist view the result?',o:['As useful','As embarrassing','As final'],a:0} ],
 [ {t:'While sales of e-books grew rapidly at first, printed book sales have remained surprisingly stable.',q:'What does "surprisingly" suggest?',o:['Many expected print sales to fall.','Print books are cheaper.','E-books are disappearing.'],a:0},
   {t:'The article was written by a researcher whose study was funded by a sugar company.',q:'Why might a reader be careful?',o:['There may be a conflict of interest.','The researcher is too young.','The article is too short.'],a:0},
   {t:'Water use in the city fell by 20% after prices doubled.',q:'What can we infer?',o:['Price influenced consumption.','It rained more.','The population doubled.'],a:0} ],
 [ {t:'The author admits that the evidence is "limited" but argues that the trend "deserves attention".',q:'What is the author doing?',o:['Making a careful, hedged claim','Rejecting the evidence','Stating a proven fact'],a:0},
   {t:'Applications to the engineering programme rose sharply after a popular TV series about robotics.',q:'What is suggested?',o:['Media can influence career choices.','Engineering became easier.','The programme reduced fees.'],a:0},
   {t:'Unlike her colleagues, who praised the design, the architect\'s mentor said nothing at all.',q:'What can be inferred about the mentor?',o:['She may have had doubts.','She designed it herself.','She was absent.'],a:0} ],
 [ {t:'The new vaccine performed well in laboratory tests; trials in humans will begin next year.',q:'What can we conclude?',o:['Its effect on people is not yet known.','It is already available.','It failed in the lab.'],a:0},
   {t:'Visitors to the national park doubled, but the number of rangers stayed the same.',q:'What problem might result?',o:['Less supervision per visitor','Fewer tourists','Lower ticket prices'],a:0},
   {t:'The CEO described the year as "challenging but full of lessons".',q:'What does this suggest about the year?',o:['Results were probably disappointing.','It was the best year ever.','Nothing happened.'],a:0} ]
];
