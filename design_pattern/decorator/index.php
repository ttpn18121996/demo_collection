<?php

interface Sendable
{
    public function setMessage($message);
    public function getMessage();
    public function sendMessage();
}

class Notifier implements Sendable
{
    public function __construct(
        protected $message = '',
    ) {}

    public function setMessage($message)
    {
        $this->message = $message;

        return $this;
    }

    public function getMessage()
    {
        return $this->message;
    }

    public function sendMessage()
    {
        echo "Notifier: {$this->message}\n";
    }
}

abstract class SenderDecorator implements Sendable
{
    protected $message;
    protected Sendable $sender;

    public function __construct(Sendable $sender)
    {
        $this->setSender($sender);
    }

    public function getSender(): Sendable
    {
        return $this->sender;
    }

    public function setSender(Sendable $sender)
    {
        $this->sender = $sender;
        $this->setMessage($sender->getMessage());

        return $this;
    }

    public function setMessage($message)
    {
        $this->message = $message;

        return $this;
    }

    public function getMessage()
    {
        return $this->message;
    }
}

class FacebookSenderDecorator extends SenderDecorator
{
    public function sendMessage()
    {
        echo "Facebook: {$this->getMessage()}\n";
        $this->sender->sendMessage();
    }
}

class SmsSenderDecorator extends SenderDecorator
{
    public function sendMessage()
    {
        echo "SMS: {$this->getMessage()}\n";
        $this->sender->sendMessage();
    }
}

class GmailSenderDecorator extends SenderDecorator
{
    public function sendMessage()
    {
        echo "Gmail: {$this->getMessage()}\n";
        $this->sender->sendMessage();
    }
}

$notifier = new Notifier('Hello mother fucker');
$fb = new FacebookSenderDecorator($notifier);
$sms = new SmsSenderDecorator($fb);
$gmail = new GmailSenderDecorator($sms);
$gmail->sendMessage();
