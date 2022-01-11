//
// Created by josh on 1/11/22.
//
#pragma once
#include <memory>
#include <SDL.h>

class RenderingEngine {
    std::unique_ptr<SDL_Window,decltype(&SDL_DestroyWindow)> window;
public:
    RenderingEngine();
    ~RenderingEngine();
};
