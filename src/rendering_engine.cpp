//
// Created by josh on 1/11/22.
//

#include "rendering_engine.h"
#include "spdlog/spdlog.h"
#include <stdexcept>

static SDL_Window *create_window() {
    SDL_Window* window = SDL_CreateWindow("Shader Viewer", SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, 1920, 1080,
                     SDL_WINDOW_OPENGL
                     | SDL_WINDOW_MAXIMIZED
                     | SDL_WINDOW_RESIZABLE);
    if(window == nullptr)
        throw std::runtime_error("Window creation failed");
    return window;
}

RenderingEngine::RenderingEngine()
        : window(std::unique_ptr<SDL_Window, decltype(&SDL_DestroyWindow)>(create_window(), SDL_DestroyWindow)) {

}

RenderingEngine::~RenderingEngine() {
    spdlog::info("Renderer shutting down");

}
