<?php

interface RoomService
{
    public function getPrice();
    public function getDescription();
}

class DoubleRoomService implements RoomService
{
    public function getPrice()
    {
        return 100;
    }

    public function getDescription()
    {
        return 'Double room service';
    }
}

abstract class RoomDecorator implements RoomService
{
    public function __construct(
        protected RoomService $roomService,
    ) {}

    public function getRoom(): RoomService
    {
        return $this->roomService;
    }

    public function setRoom(RoomService $roomService)
    {
        $this->roomService = $roomService;
        return $this;
    }
}

class WifiDecorator extends RoomDecorator
{
    public function getPrice()
    {
        return $this->roomService->getPrice() + 50;
    }
    
    public function getDescription()
    {
        return $this->roomService->getDescription() . ' + wifi';
    }
}

class BedDecorator extends RoomDecorator
{
    public function getPrice()
    {
        return $this->roomService->getPrice() + 20;
    }
    
    public function getDescription()
    {
        return $this->roomService->getDescription() . ' + bed';
    }
}

$dRoom = new DoubleRoomService();
echo $dRoom->getDescription();
echo "\n";
echo $dRoom->getPrice();
echo "\n";

$wService = new WifiDecorator($dRoom);
echo $wService->getDescription();
echo "\n";
echo $wService->getPrice();
echo "\n";

$bService = new BedDecorator($dRoom);
echo $bService->getDescription();
echo "\n";
echo $bService->getPrice();
echo "\n";

$wService->setRoom($bService);
echo $wService->getDescription();
echo "\n";
echo $wService->getPrice();
echo "\n";
