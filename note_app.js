const FS = require('fs');
const YARGS = require('yargs');

const FILENAME = 'notes_data.txt'

var readFile = (filename) => {
    try{
        var content = FS.readFileSync(filename);
        return JSON.parse(content);
    }catch(e){
        return [];
    }
};

var writeFile = (filename,data) => {
    if(filename===undefined||data===undefined){
        return undefined;
    }
    FS.writeFileSync(filename,data);
};

var printNote = (note) => {
    console.log(`-----\n Title : ${note.title} \n Body : ${note.body}\n`);
} 

const titleOptions = {
    describe: 'Title of note',
    demand: true,
    alias: 't'
};
const bodyOptions = {
    describe: 'Body of note',
    demand: true,
    alias: 'b'
};

const argv = YARGS
    .command('read', 'Read a note', {
        title: titleOptions,
    })
    .command('add', 'Add a new note', {
        title: titleOptions,
        body: bodyOptions
    })
    .command('list', 'List all nodes')
    .command('delete', 'Delete a node', {
        title: titleOptions
    })
    .help()
    .argv;
const operation = argv._[0];

var notes = readFile(FILENAME);

if(operation === 'read'){

    if(notes.length){
        var note = notes.filter((note) => { return note.title === argv.title; });
        if(note.length){
            printNote(note[0]);
        }else{
            console.log(`Note with ${argv.title} does not exist`);
        }
    }

}else if(operation === 'add'){
    
    const note = {
        'title' : argv.title,
        'body' : argv.body
    };

    var dupplicate = notes.filter(note => { return note.title === argv.title });

    if(!dupplicate.length){
        notes.push(note);
        writeFile(FILENAME,JSON.stringify(notes));
        printNote(note);
    }else{
        console.log("Note with that title already exists alraedy exists")
    }
    
}else if(operation === 'list'){
    
    console.log("List of all notes are :\n");
    notes.forEach(note => {printNote(note)});

}else if(operation === 'delete'){

   var notesToWrite = notes.filter(note => {return note.title !== argv.title});
    FS.writeFileSync(FILENAME,JSON.stringify(notesToWrite));
    console.log("Node deleted");

}else{
    console.log('Invalid Operation');
}