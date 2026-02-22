// A node holding a message and a reference to the next node
export class MessageNode<T> {
  value: T;
  next: MessageNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

// A generic Queue implemented using a Linked List (FIFO)
export class MessageQueue<T> {
  private head: MessageNode<T> | null = null;
  private tail: MessageNode<T> | null = null;
  private length: number = 0;

  // Add an item to the end of the queue
  enqueue(item: T): void {
    const newNode = new MessageNode(item);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      if (this.tail) {
        this.tail.next = newNode;
      }
      this.tail = newNode;
    }
    this.length++;
  }

  // Remove and return the first item from the queue
  dequeue(): T | null {
    if (!this.head) {
      return null;
    }
    const value = this.head.value;
    this.head = this.head.next;
    this.length--;
    
    if (this.length === 0) {
      this.tail = null;
    }
    return value;
  }

  // Check if the queue is empty
  isEmpty(): boolean {
    return this.length === 0;
  }

  // Get current size of the queue
  size(): number {
    return this.length;
  }
}
