package main

import (
	"sync"
	
)

type Recipient struct {
	Name  string
	Email string
}

func main() {

recipientChannel :=make(chan Recipient)	//unbufferd channel

go func ()  {
 	
	loadRecipient("emails.csv",recipientChannel)
}()

var wg sync.WaitGroup

workerCount :=5

for i := 0; i < workerCount; i++ {
	wg.Add(1)
	go emailWorker(i,recipientChannel,&wg)
}
wg.Wait()

// => send to the consumer 

}
