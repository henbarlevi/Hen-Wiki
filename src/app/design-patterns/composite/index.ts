/**Component */
interface SongComponent {
    Name: string,
    play(): void
}

/**Composite */
//each songCollection can contain number of songCollections/individual songs
class SongCollection implements SongComponent {
    private collection: SongComponent[] = [];
    get Name() { return this.name; }

    constructor(private name: string) { }

    play(): void {
        console.log('Start playing the song collection ' + this.name)
        for (let songComponent of this.collection) {
            songComponent.play();
        }
    }
    //can add a collectio of songs/song
    add(songComponent:SongComponent){
        this.collection.push(songComponent);
    }
    remove(songComponent:SongComponent){
        const index= this.collection.indexOf(songComponent);
        if (index > -1) {
            this.collection.splice(index, 1);
        }
    }
}
/**Leaf */
class Song implements SongComponent {
    play(): void {
        console.log('playing the song ' + this.name);
    }
    constructor(private name: string) { }
    get Name() { return this.name; }
}


//RUN CODE

const musicArchive = new SongCollection('musice archive');
const countryCollection = new SongCollection('Rock Collection');
const shakeyGravesCollection = new SongCollection('Shakey Graves Singer');
shakeyGravesCollection.add(new Song('Shakey Graves - Late July'));
shakeyGravesCollection.add(new Song('Shakey Graves - dearly departed'));
countryCollection.add(shakeyGravesCollection);
musicArchive.add(countryCollection);